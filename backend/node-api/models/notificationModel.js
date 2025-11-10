// node-api/models/notificationModel.js
const { query } = require("../config/db");

async function createNotification({ title, message }) {
  const { rows } = await query(
    `INSERT INTO notification (title, message)
     VALUES ($1,$2)
     RETURNING notif_id, title, message, created_at`,
    [title, message]
  );
  return rows[0];
}

async function addRecipients(notifId, userIds) {
  if (!userIds?.length) return 0;
  const values = [];
  const params = [];

  userIds.forEach((uid, i) => {
    params.push(`($${i * 2 + 1}, $${i * 2 + 2})`);
    values.push(notifId, uid);
  });

  const sql = `
    INSERT INTO notification_recipient (notif_id, user_id, is_read)
    VALUES ${params.join(",")}
    ON CONFLICT DO NOTHING
  `;
  const res = await query(sql, values);
  return res.rowCount ?? 0;
}

async function getStakeholderUserIds(roles = ["admin", "dosen"]) {
  const placeholders = roles.map((_, i) => `$${i + 1}`).join(",");
  const { rows } = await query(
    `SELECT user_id FROM "user" WHERE role IN (${placeholders})`,
    roles
  );
  return rows.map(r => r.user_id);
}

async function listNotificationsForUser(user_id, { limit = 50, offset = 0 } = {}) {
  const { rows } = await query(
    `SELECT nr.recipient_id, n.notif_id, n.title, n.message, n.created_at,
            nr.is_read, nr.read_at
     FROM notification_recipient nr
     JOIN notification n ON n.notif_id = nr.notif_id
     WHERE nr.user_id=$1
     ORDER BY n.created_at DESC
     LIMIT $2 OFFSET $3`,
    [user_id, limit, offset]
  );
  return rows;
}

async function markAsRead(recipient_id, user_id) {
  const { rows } = await query(
    `UPDATE notification_recipient
     SET is_read=TRUE, read_at=NOW()
     WHERE recipient_id=$1 AND user_id=$2
     RETURNING recipient_id`,
    [recipient_id, user_id]
  );
  return rows[0];
}

module.exports = {
  createNotification,
  addRecipients,
  getStakeholderUserIds,
  listNotificationsForUser,
  markAsRead,
};
