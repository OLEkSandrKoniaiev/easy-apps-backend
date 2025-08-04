import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(express.json());

// Підключаємо Morgan middleware залежно від середовища
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Шляхи
app.use('/auth', authRoutes);

app.get('/', (_req, res) => {
  res.send('Hello World');
});

export default app;
