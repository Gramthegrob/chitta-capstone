const router = require('express').Router();
const { getAIResponse } = require('../controllers/konsultasiController');

// Route untuk chat konsultasi (tanpa auth requirement untuk testing)
router.post('/chat', getAIResponse);

module.exports = router;