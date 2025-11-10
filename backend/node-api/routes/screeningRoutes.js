// node-api/routes/screeningRoutes.js
const router = require("express").Router();
const { authRequired } = require("../middlewares/authMiddleware");
const { doScreening } = require("../controllers/screeningController");

router.post("/", authRequired, doScreening);

module.exports = router;
