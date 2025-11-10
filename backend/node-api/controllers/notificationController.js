// node-api/controllers/notificationController.js
const {
  listNotificationsForUser,
  markAsRead,
  createNotification,
  addRecipients,
  getStakeholderUserIds,
} = require("../models/notificationModel");

async function getMyNotifications(req, res, next) {
  try {
    const user_id = req.user.id;
    const { limit, offset } = req.query;
    const items = await listNotificationsForUser(user_id, {
      limit: Number(limit)||50, offset: Number(offset)||0
    });
    res.json({ items });
  } catch (e) { next(e); }
}

async function readMyNotification(req, res, next) {
  try {
    const user_id = req.user.id;
    const { recipientId } = req.params;
    const ok = await markAsRead(recipientId, user_id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  } catch (e) { next(e); }
}

async function broadcastToStakeholders(req, res, next) {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    const { title, message } = req.body;
    const notif = await createNotification({ title, message });
    const stakeholders = await getStakeholderUserIds(["admin","dosen"]);
    await addRecipients(notif.notif_id, stakeholders);
    res.status(201).json({ notif_id: notif.notif_id, recipients: stakeholders.length });
  } catch (e) { next(e); }
}

module.exports = { getMyNotifications, readMyNotification, broadcastToStakeholders };
