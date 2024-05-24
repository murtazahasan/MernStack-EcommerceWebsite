import multer from 'multer';
import path from 'path';

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Initialize upload
const upload = multer({ storage });

export default upload;
