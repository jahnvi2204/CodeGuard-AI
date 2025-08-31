const express = require('express');
const AnalysisController = require('../controllers/analysisController');
const { validateCode } = require('../middleware/validation');

const router = express.Router();

router.post('/analyze-code', validateCode, AnalysisController.analyzeCode);
router.post('/analyze-vulnerabilities', validateCode, AnalysisController.analyzeVulnerabilities);
router.post('/analyze-performance', validateCode, AnalysisController.analyzePerformance);
router.post('/test-ml-connection', AnalysisController.testMLConnection);

module.exports = router;