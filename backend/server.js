const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const docRoutes = require('./routes/docRoutes');
const rawDataRoutes = require('./routes/rawDataRoutes');
const logRoutes = require('./routes/logRoutes');
const userRoutes = require('./routes/userRoutes');
const  adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


dotenv.config();
const app = express();

//app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/docs', docRoutes);
app.use('/api/raw', rawDataRoutes);
//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// filepath: c:\Users\mantu\OneDrive\Desktop\PharmaDocs\backend\server.js
mongoose.connect(process.env.MONGO_URI
 ).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}).then(() => {
  console.log('MongoDB connected successfully');
});
app.use('/api/auth', authRoutes);

app.use('/api/payment', paymentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api', logRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
