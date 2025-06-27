const express = require('express');
const LanguageController = require('../controllers/languageController');
const { validateCode } = require('../middleware/validation');

const router = express.Router();

router.post('/detect-language', validateCode, LanguageController.detectLanguage);

module.exports = router;