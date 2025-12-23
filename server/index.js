import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/db.js';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running...');
});

app.listen(PORT, () => {
  // console.log(`Server is running on ${PORT}`);
});