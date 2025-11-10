// node-api/controllers/monitoringController.js
const { PY } = require("../config/env");
const { createHttp } = require("../utils/httpClient");
const { insertMonitoring } = require("../models/monitoringModel");

const http = createHttp(PY.monitoringBase);

async function predictHr(req, res, next) {
  try {
    const user_id = req.user.id;
    // Misal kirim array HR window ke model
    const { windowHR } = req.body; // [60,61,...] panjang sesuai model
    const { data } = await http.post("/predict-hr", { windowHR });

    // opsional simpan ke PG
    if (data?.heart_rate) {
      await insertMonitoring({
        user_id,
        heart_rate: data.heart_rate,
        risk_level_hr: data.risk_level || null
      });
    }

    res.json(data);
  } catch (e) { next(e); }
}

module.exports = { predictHr };
