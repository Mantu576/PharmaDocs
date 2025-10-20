const express = require('express');
const path=require('path');
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
const DocumentHistoryRoutes= require('./routes/documentHistoryRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const newDocRoutes = require('./routes/newDcoRoutes');


dotenv.config();
const app = express();

//app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

//app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.resolve('uploads')));

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
app.use('/api/modules', moduleRoutes);
app.use('/api/newdoc', newDocRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/history', DocumentHistoryRoutes);
app.use('/api', logRoutes);
// 🧩 Serve frontend (after build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));
app.get("*", (_, res) => res.sendFile(path.join(frontendPath, "index.html")));

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
