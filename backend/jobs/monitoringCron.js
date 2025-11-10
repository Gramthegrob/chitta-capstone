const cron = require("node-cron");
const pool = require("../config/db");
const { syncHeartRate, syncSleep } = require("../services/healthGatewayService");

async function getActiveUsersWithToken() {
  const { rows } = await pool.query(
    `SELECT DISTINCT u.user_id, ak.api_key
       FROM "user" u
       JOIN api_key ak ON ak.user_id = u.user_id
      WHERE ak.status='active'`
  );
  return rows;
}

function startMonitoringCron() {
  if (String(process.env.CRON_ENABLED).toLowerCase() !== "true") return;

  // jalan tiap jam menit ke-15 (hindari beban di menit 00)
  cron.schedule("15 * * * *", async () => {
    const windowHours = parseInt(process.env.SYNC_WINDOW_HOURS || "48", 10);
    const sinceISO = new Date(Date.now() - windowHours * 3600 * 1000).toISOString();

    const users = await getActiveUsersWithToken();
    for (const u of users) {
      try {
        const a = await syncHeartRate({ userId: u.user_id, token: u.api_key, sinceISO });
        const b = await syncSleep({ userId: u.user_id, token: u.api_key, sinceISO });
        console.log(`[cron] user=${u.user_id} imported hr=${a} sleep=${b}`);
      } catch (err) {
        console.error(`[cron] user=${u.user_id} error:`, err.message);
      }
    }
  });

  console.log("[cron] monitoring job scheduled (minute 15 hourly)");
}

module.exports = { startMonitoringCron };
