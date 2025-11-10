// node-api/controllers/jurnalHarianController.js
const { createJurnal, listJurnalByUser } = require("../models/jurnalHarianModel");

async function create(req, res, next) {
  try {
    const user_id = req.user.id;
    const { number_id, judul_jurnal, isi_jurnal, tanggal_jurnal = null } = req.body;
    const row = await createJurnal({ user_id, number_id, judul_jurnal, isi_jurnal, tanggal_jurnal });
    res.status(201).json(row);
  } catch (e) { next(e); }
}

async function listMine(req, res, next) {
  try {
    const user_id = req.user.id;
    const rows = await listJurnalByUser(user_id);
    res.json({ items: rows });
  } catch (e) { next(e); }
}

module.exports = { create, listMine };
