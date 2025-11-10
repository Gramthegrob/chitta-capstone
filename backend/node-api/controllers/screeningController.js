// node-api/controllers/screeningController.js
const { PY } = require("../config/env");
const { createHttp } = require("../utils/httpClient");
const { insertScreeningResult } = require("../models/screeningResultModel");
const { createAlertForScreening } = require("../services/notificationService");

const http = createHttp(PY.screeningBase);

async function doScreening(req, res, next) {
  try {
    const user_id = req.user.id;
    const payload = req.body; // { jawaban: {...} }

    const { data } = await http.post("/api/screening", payload);
    // data: { Depresi:{kategori,keterangan}, Kecemasan:{...}, Stres:{...} }

    // simpulkan risk tertinggi untuk ringkasan
    const rank = { "Normal": 0, "Ringan": 1, "Sedang": 2, "Berat": 3, "Sangat Berat": 4 };
    const best = Object.entries(data).sort((a,b) => rank[b[1].kategori]-rank[a[1].kategori])[0];
    const result_summary = best ? `${best[0]}: ${best[1].kategori}` : "Normal";
    const risk_level = (best && ["Sedang","Berat","Sangat Berat"].includes(best[1].kategori))
      ? "high" : (best && best[1].kategori==="Ringan" ? "medium" : "low");

    await insertScreeningResult({ user_id, result_summary, risk_level });

    // trigger notifikasi jika perlu
    await createAlertForScreening(user_id, data);

    res.json({ result: data, summary: { result_summary, risk_level } });
  } catch (e) { next(e); }
}

module.exports = { doScreening };
