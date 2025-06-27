const express = require('express');
const healthRoutes = require('./health');
const languageRoutes = require('./language');
const analysisRoutes = require('./analysis');

const router = express.Router();

router.use('/api', healthRoutes);
router.use('/api', languageRoutes);
router.use('/api', analysisRoutes);

module.exports = router;