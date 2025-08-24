const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processSTP } = require('../controllers/docController');
const {auth}=require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
//router.post('/stp', verifyToken, upload.single('stpFile'), processSTP);
const upload = multer({ storage });
router.post(
  '/stp', auth,
  upload.fields([
    { name: 'stpFile', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
  ]),
  processSTP
);

module.exports = router;
