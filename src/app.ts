import express from 'express';
import morgan from 'morgan';
import { connectDB } from './configs/database.config';

connectDB();

const app = express();

// Підключаємо Morgan middleware
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.send('Hello World');
});

export default app;
