// src/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Логування часу
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Глобальні middleware
app.use(logger); // 1. Логер першим — бачить усі запити
app.use(express.json()); // 2. Парсинг JSON-тіла
app.use(
  cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
); // 3. Дозвіл CORS-запитів з вказаними методами
app.use(helmet()); // 4. Безпека HTTP-заголовків

// Перший маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world!' });
});

// Маршрут для тестування middleware помилки
app.get('/test-error', (req, res) => {
  // Штучна помилка для прикладу
  throw new Error('Simulated server error');
});

// підключаємо групу маршрутів нотаток
app.use(notesRoutes);

// 404 і обробник помилок — наприкінці ланцюжка
app.use(notFoundHandler);
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
