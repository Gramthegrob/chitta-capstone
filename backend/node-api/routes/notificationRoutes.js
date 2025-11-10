// node-api/routes/notificationRoutes.js
const router = require("express").Router();
const { authRequired } = require("../middlewares/authMiddleware");
const { getMyNotifications, readMyNotification, broadcastToStakeholders } =
  require("../controllers/notificationController");

router.get("/me", authRequired, getMyNotifications);
router.patch("/:recipientId/read", authRequired, readMyNotification);
router.post("/broadcast", authRequired, broadcastToStakeholders);

module.exports = router;
