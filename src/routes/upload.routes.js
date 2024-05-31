// src/routes/upload.routes.js
import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import cloudinary from '../config/cloudinaryConfig.js';
import fs from 'fs';

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  const filePath = req.file.path;

  cloudinary.uploader.upload(filePath, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: 'Failed to upload file to Cloudinary',
        error: error.message,
      });
    }

    // Remove the file from the server after uploading to Cloudinary
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({
          message: 'Failed to remove file from server',
          error: err.message,
        });
      }
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
      imageUrl: result.secure_url, // Cloudinary image URL
    });
  });
});

export default router;
