// node-api/services/notificationService.js
const {
  createNotification,
  addRecipients,
  getStakeholderUserIds,
} = require("../models/notificationModel");

/**
 * Buat notifikasi otomatis jika kategori >= ambang
 * hasil: { Depresi:{kategori,keterangan}, Kecemasan:{...}, Stres:{...} }
 */
async function createAlertForScreening(user_id, hasil, alertLevels = ["Sedang","Berat","Sangat Berat"]) {
  const triggered = Object.entries(hasil)
    .filter(([, val]) => alertLevels.includes(val?.kategori))
    .map(([aspek, val]) => ({ aspek, kategori: val.kategori, keterangan: val.keterangan }));

  if (triggered.length === 0) return null;

  const title = `Peringatan Screening: ${triggered.map(t => `${t.aspek}(${t.kategori})`).join(", ")}`;
  const message = triggered.map(t => `• ${t.aspek}: ${t.kategori} — ${t.keterangan}`).join("\n");

  const notif = await createNotification({ title, message });
  const stakeholderIds = await getStakeholderUserIds(["admin","dosen"]);
  const recipients = Array.from(new Set([...stakeholderIds, user_id]));

  await addRecipients(notif.notif_id, recipients);
  return { notif, recipients };
}

module.exports = { createAlertForScreening };
