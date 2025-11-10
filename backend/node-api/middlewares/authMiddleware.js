// node-api/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const { JWT } = require("../config/env");
const { getById } = require("../models/userModel");

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT.secret);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function attachUser(req, _res, next) {
  if (!req.user?.id) return next();
  try {
    const dbUser = await getById(req.user.id);
    if (dbUser) req.user = { ...req.user, full_name: dbUser.full_name, nim_nip: dbUser.nim_nip };
  } catch {}
  next();
}

module.exports = { authRequired, attachUser };
