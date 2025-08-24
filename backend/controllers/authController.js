const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecret';
const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail'); // Assuming you have a utility to send emails

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ success: true, msg: 'User registered successfully' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, msg: 'Registration failed' });
  }
};


// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//    // console.log("📥 Login attempt:", email, password);

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("❌ No user found for:", email);
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("❌ Password mismatch for:", email);
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     if (user.activeSession) {
//       console.log("⚠️ Already logged in:", email);
//       return res.status(403).json({ msg: "Already logged in on another device" });
//     }

//     user.activeSession = true;
//     await user.save();

//     const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1h" });
//     res.json({ success: true, token });
//   } catch (err) {
//     console.error("🔥 Login error:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email); // debugging
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.logout = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'User not found' });


  user.activeSession = false;
  await user.save();

  res.json({ msg: 'Logged out successfully' });
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    await sendEmail(user.email, "Password Reset Request", 
      `Click the link to reset your password: ${resetUrl}`
    );

    res.json({ msg: "Password reset link sent to email" });
  } catch (err) {
    console.error(err); // 👈 check terminal logs
    res.status(500).json({ msg: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // hash the new password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.subscribe = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

  const { plan } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  user.subscriptionPlan = plan;
  await user.save();

  res.json({ msg: 'Subscription updated successfully' });
};