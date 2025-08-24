const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { auth } = require('../middleware/authMiddleware');

router.post("/create-checkout-session", auth, async (req, res) => {
  const { plan } = req.body;
  const priceMap = { Basic: 2999, Pro: 5999, Enterprise: 9999 };
  if (!priceMap[plan]) return res.status(400).json({ msg: "Invalid plan" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: { name: `${plan} Subscription` },
          unit_amount: priceMap[plan] * 100
        },
        quantity: 1
      }
    ],
    success_url: `http://localhost:5173/payment-success?plan=${plan}`,
    cancel_url: `http://localhost:5173/payment-cancelled`
  });

  res.json({ url: session.url });
});


module.exports = router;
