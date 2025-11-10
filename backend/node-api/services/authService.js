// services/authService.js
const { findUserByNimNip, createUser } = require('../models/userModel');
const { hashPassword, verifyPassword } = require('../utils/passwordUtil');
const { signAccess } = require('../utils/tokenUtil');

exports.register = async ({ role, full_name, nim_nip, password, profil = {} }) => {
  const exist = await findUserByNimNip(nim_nip);
  if (exist) { const e = new Error('NIM/NIP sudah terdaftar'); e.status=409; throw e; }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ role, full_name, nim_nip, passwordHash, ...profil });
  const accessToken = signAccess({ sub: user.user_id, role: user.role });
  return { user, accessToken };
};

exports.login = async ({ nim_nip, password }) => {
  const user = await findUserByNimNip(nim_nip);
  if (!user) { const e = new Error('User tidak ditemukan'); e.status=401; throw e; }
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) { const e = new Error('Password salah'); e.status=401; throw e; }

  const token = signAccess({ sub: user.user_id, role: user.role });
  return {
    user: {
      user_id: user.user_id, full_name: user.full_name, role: user.role,
      nim_nip: user.nim_nip, jurusan: user.jurusan, fakultas: user.fakultas,
      semester: user.semester, jenis_kelamin: user.jenis_kelamin, profile_picture: user.profile_picture
    },
    token
  };
};
