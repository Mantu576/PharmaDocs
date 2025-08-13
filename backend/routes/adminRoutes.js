const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DocLog = require('../models/Log');
const {verifyToken}=require('../middleware/authMiddleware');

// List all users
router.get('/users', verifyToken,  async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Get user by ID
router.get('/user/:id', verifyToken,  async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.json(user);
});
// Delete user by ID
router.delete('/user/:id', verifyToken,  async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.json({ msg: 'User deleted successfully' });
});


// Update user plan
router.put('/user/:id/plan', verifyToken,  async (req, res) => {
  const { plan, modules } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, {
    subscriptionPlan: plan,
    modulesAllowed: modules
  }, { new: true });
  res.json(user);
});

// Doc statistics
router.get('/doc-stats', verifyToken,  async (req, res) => {
  const count = await DocLog.countDocuments();
  const users = await User.countDocuments();
  res.json({ documentsGenerated: count, totalUsers: users });
});

// GET /api/admin/stats

router.get("/stats", async (req, res) => {
  try {
    const totalDocs = await DocLog.countDocuments();
    const totalUsers = await User.countDocuments();
    //const activeSessions = await Session.countDocuments({ active: true });

    const docsPerUser = await DocLog.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          username: "$user.username",
          email: "$user.email",
          count: 1
        }
      }
    ]);

    const users = await User.find({}, "username email subscriptionPlan");

    res.json({ totalDocs, totalUsers, activeSessions, docsPerUser, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PATCH /api/admin/user/:id/plan

router.patch("/user/:id/plan", verifyToken,  async (req, res) => {
  try {
    const { plan } = req.body;
    await User.findByIdAndUpdate(req.params.id, { subscriptionPlan: plan });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;