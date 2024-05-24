import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to upload file',
      error: err.message,
    });
  }
});

export default router;
