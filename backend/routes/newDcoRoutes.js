const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/authMiddleware');
const { previewNewDoc, commitNewDoc } = require('../controllers/newDocController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

router.post(
  '/preview',
  auth,
  upload.fields([
    { name: 'stpFile', maxCount: 1 },
    { name: 'rawData', maxCount: 1 },
    // { name: 'logo', maxCount: 1 },
  ]),
  previewNewDoc
);

router.post('/commit', auth, commitNewDoc);

module.exports = router;