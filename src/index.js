import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userAuth from './routes/userAuth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import connectDB from './db/index.js';

// Initialize configuration
dotenv.config();
const app = express();

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Enable CORS with preflight
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
app.use('/user', userAuth);
app.use('/api', uploadRoutes);

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
