import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// Для отримання __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Константа-шлях до розташування файлу БД
const dbPath = path.resolve(__dirname, 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Встановіть true, щоб бачити SQL-запити в консолі
});

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite has been established successfully.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Unable to connect to the database:', error.message);
    } else {
      console.error('An unknown error occurred while connecting to the database:', error);
    }
  }
};

export { sequelize, connectDB };
