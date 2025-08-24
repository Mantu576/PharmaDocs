// controllers/historyController.js
const History = require('../models/History');

exports.myHistory = async (req, res) => {
  try {
    const list = await History.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    console.error('myHistory error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.allHistory = async (req, res) => {
  try {
    const list = await History.find({})
      .populate('userId', 'username email')
      .sort({ timestamp: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    console.error('allHistory error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
