import express from 'express';
import { connectDB } from './configs/database.config';

connectDB();

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello World');
});

export default app;
