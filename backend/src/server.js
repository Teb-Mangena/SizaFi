import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
// Local imports
import { ENV } from './lib/env.js';

// create express app
const app = express();
const { PORT } = ENV;

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// sample route
app.get('/', (req, res) => {
  res.send('Welcome to the SizaFi backend!');
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});