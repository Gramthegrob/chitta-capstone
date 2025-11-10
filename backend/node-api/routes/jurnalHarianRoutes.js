// node-api/routes/jurnalHarianRoutes.js
const router = require("express").Router();
const { authRequired } = require("../middlewares/authMiddleware");
const { create, listMine } = require("../controllers/jurnalHarianController");

router.post("/", authRequired, create);
router.get("/me", authRequired, listMine);

module.exports = router;
