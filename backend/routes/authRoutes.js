const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {verifyToken}=require('../middleware/authMiddleware');
// Register
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashed });
    res.json({ success: true, user: { email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid email or password" });

    // Sign token with same secret as verifyToken
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token, user: { email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
  
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }

//     // Create JWT only after successful login
//     const token = jwt.sign(
//       { email: user.email, username: user.username, role: user.role || 'user' },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({
//       success: true,
//       token,
//       user: { email: user.email, username: user.username }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });
// Route to allow user to update their own plan
// router.put('/user/me/plan', verifyToken, async (req, res) => {
//   const { plan, modules } = req.body;
//   const user = await User.findByIdAndUpdate(req.user._id, {
//     subscriptionPlan: plan,
//     modulesAllowed: modules
//   }, { new: true });
//   res.json(user);
// });

module.exports = router;
