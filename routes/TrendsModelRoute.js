const express = require('express');
const router = express.Router();
const axios = require('axios');

const FLASK_API_URL = 'http://localhost:5000';

// Middleware to handle Python API errors 
const handlePythonApiError = (error, res) => {
    console.error('Python API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
        error: 'Error processing trend analysis',
        details: error.response?.data || error.message
    });
};

// Route to analyze trends
router.post('/analyze', async (req, res) => {
    try {
        const { keywords } = req.body;
        
        if (!keywords || !Array.isArray(keywords)) {
            return res.status(400).json({ error: 'Invalid keywords format' });
        }

        const response = await axios.post(`${FLASK_API_URL}/analyze`, { keywords });
        res.json(response.data);
    } catch (error) {
        handlePythonApiError(error, res);
    }
});

// Route to get predictions for a specific keyword
router.get('/predictions/:keyword', async (req, res) => {
    try {
        const { keyword } = req.params;
        const response = await axios.get(`${FLASK_API_URL}/predictions/${keyword}`);
        res.json(response.data);
    } catch (error) {
        handlePythonApiError(error, res);
    }
});

module.exports = router;