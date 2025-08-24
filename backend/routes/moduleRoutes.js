const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const { getAvailableModules } = require('../controllers/modulesController');

router.get('/available', auth, getAvailableModules);


module.exports = router;