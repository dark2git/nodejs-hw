// src/server.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate'; // Імпортуємо middleware помилок celebrate
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Імпортуємо маршрути користувачів
import notesRoutes from './routes/notesRoutes.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger); // 1. Логер першим — бачить усі запити
app.use(express.json()); // 2. Парсинг JSON-тіла
app.use(
  cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
); // 3. Дозвіл CORS-запитів з вказаними методами
app.use(helmet()); // 4. Безпека HTTP-заголовків
app.use(cookieParser()); // 5. Розбір cookie

// Перший маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world!' });
});

// підключаємо групу маршрутів авторизації користувачів та нотаток
app.use(authRoutes);
app.use(userRoutes);
app.use(notesRoutes);

// Додаємо middleware помилок celebrate
app.use(errors());
// Це має бути розміщено перед іншими обробниками помилок

// 404 і обробник помилок — наприкінці ланцюжка
app.use(notFoundHandler);
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
