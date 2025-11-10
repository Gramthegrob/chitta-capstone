// node-api/models/monitoringModel.js
const { query } = require("../config/db");

/** Simpan HR, risk_level, dsb jika kamu ingin menyimpan ke PG */
async function insertMonitoring({ user_id, recorded_at = null, heart_rate, risk_level_hr = null, sleep_duration = null, sleep_quality = null }) {
  const { rows } = await query(
    `INSERT INTO monitoring(user_id, recorded_at, heart_rate, risk_level_hr, sleep_duration, sleep_quality)
     VALUES ($1, COALESCE($2, NOW()), $3, $4, $5, $6)
     RETURNING monitoring_id, user_id, recorded_at, heart_rate, risk_level_hr`,
    [user_id, recorded_at, heart_rate, risk_level_hr, sleep_duration, sleep_quality]
  );
  return rows[0];
}

module.exports = { insertMonitoring };
