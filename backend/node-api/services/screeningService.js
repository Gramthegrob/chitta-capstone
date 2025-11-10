// services/screeningService.js
const screeningModel = require('../models/screeningModel');
const { callScreeningCF } = require('./pythonClient');

exports.submit = async (userId, body) => {
  const jawaban = body?.jawaban || {};
  const hasil = await callScreeningCF(jawaban);

  // pilih kategori terburuk untuk ringkasan
  const rank = { 'Normal': 0, 'Ringan': 1, 'Sedang': 2, 'Berat': 3, 'Sangat Berat': 4 };
  const cats = [hasil?.Depresi?.kategori, hasil?.Kecemasan?.kategori, hasil?.Stres?.kategori].filter(Boolean);
  const worst = cats.sort((a,b)=>(rank[b]??0)-(rank[a]??0))[0] || 'Normal';

  const saved = await screeningModel.insertScreening({
    userId,
    result_summary: JSON.stringify(hasil),
    risk_level: worst
  });

  return { saved, hasil };
};

exports.history = async (userId, limit=20) => screeningModel.listByUser(userId, limit);
