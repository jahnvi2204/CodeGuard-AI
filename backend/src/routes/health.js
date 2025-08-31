const express = require('express');
const HealthController = require('../controllers/healthController');

const router = express.Router();

router.get('/health', HealthController.getHealth);
router.get('/ml-status', HealthController.getMLStatus);

module.exports = router;