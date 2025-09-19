import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
// Local imports
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
// routes
import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';

// create express app
const app = express();
const { PORT } = ENV;

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// sample route
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

// connect DB & start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});