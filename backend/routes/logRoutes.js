// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const Log = require('../models/Log');

// GET logs with pagination & filters
router.get('/admin/logs', logController.getLogs);

// GET export CSV (uses same filters)
router.get('/admin/logs/export', logController.exportLogsCSV);
// GET all logs (for admin dashboard)
router.get('/admin/logs/all', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).lean();
    res.json(logs);
  } catch (err) {
    console.error('Error fetching all logs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
