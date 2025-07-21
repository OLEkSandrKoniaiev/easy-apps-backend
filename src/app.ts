import express from 'express';
import morgan from 'morgan';

const app = express();

// Підключаємо Morgan middleware залежно від середовища
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.get('/', (_req, res) => {
  res.send('Hello World');
});

export default app;
