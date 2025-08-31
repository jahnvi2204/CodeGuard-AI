const { createErrorResponse } = require('../utils/helpers');

const validateCode = (req, res, next) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json(createErrorResponse(
            'Code is required',
            'Please provide code in the request body'
        ));
    }
    
    if (typeof code !== 'string') {
        return res.status(400).json(createErrorResponse(
            'Invalid code format',
            'Code must be a string'
        ));
    }
    
    if (code.trim().length === 0) {
        return res.status(400).json(createErrorResponse(
            'Empty code provided',
            'Code cannot be empty or whitespace only'
        ));
    }
    
    next();
};

module.exports = {
    validateCode
};