const express = require('express');
const router = express.Router();
const DocumentHistory = require('../models/History');
const { auth } = require('../middleware/authMiddleware');
const historyCtrl = require('../controllers/historyController');

// User: Get own history
// router.get('/my-history', verifyToken, async (req, res) => {
//   const history = await DocumentHistory.find({ userId: req.user._id }).sort({ timestamp: -1 });
//   res.json(history);
// });

// // Admin: Get all document histories
// router.get('/all', verifyToken,  async (req, res) => {
//   const history = await DocumentHistory.find().sort({ timestamp: -1 });
//   res.json(history);
// });
router.get('/my-history', auth, historyCtrl.myHistory);

// Admin: all users’ history
router.get('/all', auth, historyCtrl.allHistory);

module.exports = router;
