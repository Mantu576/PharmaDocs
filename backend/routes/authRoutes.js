const express = require('express');
const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const {auth}=require('../middleware/authMiddleware');
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  subscribe,
} = require("../controllers/authController");

// ✅ Register
router.post("/register", register);

// ✅ Login
router.post("/login", login);

// ✅ Logout
router.post("/logout", auth, logout);

// ✅ Forgot Password
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password
router.post("/reset-password/:token", resetPassword);

// ✅ Subscription
router.post("/subscribe", auth, subscribe);

module.exports = router;