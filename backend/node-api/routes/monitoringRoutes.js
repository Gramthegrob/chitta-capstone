// node-api/routes/monitoringRoutes.js
const router = require("express").Router();
const { authRequired } = require("../middlewares/authMiddleware");
const { predictHr } = require("../controllers/monitoringController");

router.post("/predict-hr", authRequired, predictHr);

module.exports = router;
