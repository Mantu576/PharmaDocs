const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processSTP } = require('../controllers/docController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});

const upload = multer({ storage });

router.post('/stp', upload.single('stpFile'), processSTP);

module.exports = router;
