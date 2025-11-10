// node-api/controllers/authController.js
const jwt = require("jsonwebtoken");
const { JWT } = require("../config/env");
const { hashPassword, verifyPassword } = require("../utils/passwordUtil");
const { getByNimNip, createUser } = require("../models/userModel");

function signToken(user) {
  return jwt.sign(
    { sub: user.user_id, role: user.role },
    JWT.secret,
    { expiresIn: JWT.expiresIn }
  );
}

async function register(req, res, next) {
  try {
    const { nim_nip, full_name, password, role = "mahasiswa" } = req.body;
    if (!nim_nip || !password || !full_name) {
      return res.status(400).json({ message: "nim_nip, full_name, password required" });
    }
    const exists = await getByNimNip(nim_nip);
    if (exists) return res.status(409).json({ message: "NIM/NIP already used" });

    const password_hash = await hashPassword(password);
    const user = await createUser({ role, full_name, password_hash, nim_nip, profile_picture:"" });

    const token = signToken({ user_id: user.user_id, role: user.role });
    res.status(201).json({ token, user });
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const { nim_nip, password } = req.body;
    const user = await getByNimNip(nim_nip);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ user_id: user.user_id, role: user.role });
    res.json({ token, user: { user_id: user.user_id, role: user.role, full_name: user.full_name, nim_nip: user.nim_nip } });
  } catch (e) { next(e); }
}

module.exports = { register, login };
