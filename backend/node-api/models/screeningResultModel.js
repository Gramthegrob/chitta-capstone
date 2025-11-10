// node-api/models/screeningResultModel.js
const { query } = require("../config/db");

/** Simpan ringkasan hasil screening ke table screening_result (opsional ringkas) */
async function insertScreeningResult({ user_id, result_summary, risk_level }) {
  const { rows } = await query(
    `INSERT INTO screening_result(user_id, screening_date, result_summary, risk_level)
     VALUES ($1, NOW(), $2, $3)
     RETURNING screening_id, user_id, screening_date, result_summary, risk_level`,
    [user_id, result_summary, risk_level]
  );
  return rows[0];
}

module.exports = { insertScreeningResult };
