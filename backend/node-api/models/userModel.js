// node-api/models/userModel.js
const { query } = require("../config/db");

async function getByNimNip(nim_nip) {
  const { rows } = await query(
    `SELECT user_id, role, full_name, password_hash, nim_nip
     FROM "user" WHERE nim_nip=$1`,
    [nim_nip]
  );
  return rows[0];
}

async function getById(user_id) {
  const { rows } = await query(
    `SELECT user_id, role, full_name, nim_nip FROM "user" WHERE user_id=$1`,
    [user_id]
  );
  return rows[0];
}

async function createUser({ role, full_name, password_hash, nim_nip, jurusan = null, fakultas = null, semester = null, jenis_kelamin = null, profile_picture = "" }) {
  const { rows } = await query(
    `INSERT INTO "user"(role, full_name, password_hash, nim_nip, jurusan, fakultas, semester, jenis_kelamin, profile_picture)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING user_id, role, full_name, nim_nip`,
    [role, full_name, password_hash, nim_nip, jurusan, fakultas, semester, jenis_kelamin, profile_picture]
  );
  return rows[0];
}

module.exports = { getByNimNip, getById, createUser };
