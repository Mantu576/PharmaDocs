const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth } = require("../middleware/authMiddleware");

// Update current user's subscription plan
router.put("/me/plan", auth, async (req, res) => {
  try {
    const { plan, modules } = req.body;

    if (!plan) return res.status(400).json({ msg: "Plan is required" });

    const user = await User.findByIdAndUpdate(
      req.user.id, // Comes from JWT
      {
        subscriptionPlan: plan,
        modulesAllowed: modules,
        activeSession: true
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
