// node-api/models/jurnalHarianModel.js
const { query } = require("../config/db");

async function createJurnal({ user_id, number_id, judul_jurnal, isi_jurnal, tanggal_jurnal = null }) {
  const { rows } = await query(
    `INSERT INTO jurnal_harian(user_id, number_id, judul_jurnal, isi_jurnal, tanggal_jurnal)
     VALUES ($1,$2,$3,$4, COALESCE($5, NOW()))
     RETURNING id, user_id, number_id, judul_jurnal, isi_jurnal, tanggal_jurnal`,
    [user_id, number_id, judul_jurnal, isi_jurnal, tanggal_jurnal]
  );
  return rows[0];
}

async function listJurnalByUser(user_id) {
  const { rows } = await query(
    `SELECT id, user_id, number_id, judul_jurnal, isi_jurnal, tanggal_jurnal
     FROM jurnal_harian
     WHERE user_id=$1
     ORDER BY tanggal_jurnal DESC`,
    [user_id]
  );
  return rows;
}

module.exports = { createJurnal, listJurnalByUser };
