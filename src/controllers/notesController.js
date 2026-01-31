//src/controllers/notesController.js.

import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// Отримати список усіх нотаток
export const getAllNotes = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    tag,
    search,
    sortBy = '_id',
    sortOrder = 'asc',
  } = req.query;
  const skip = (page - 1) * perPage;
  //Повертаємо тільки нотатки поточного користувача
  const notesQuery = Note.find({ userId: req.user._id });
  // Текстовий пошук по title та content (працює лише якщо створено текстовий індекс)
  if (search) {
    notesQuery.where({
      $text: { $search: search },
    });
  }
  // Будуємо фільтр
  if (tag) {
    notesQuery.where('tag').regex(new RegExp(`^${tag}$`, 'i'));
  }
  // Пагінація та сортування
  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);
  const totalPages = Math.ceil(totalNotes / perPage);
  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({
    _id: noteId,
    // Повертаємо тільки нотатку поточного користувача
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Створити нову нотатку
export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    // Додаємо властивість userId з об'єкта запиту
    userId: req.user._id,
  });
  res.status(201).json(note);
};

//Видалити нотатку
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    // Критерій пошуку по userId
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

// Оновити інформацію про нотатку
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id }, // критерій пошуку по userId
    req.body,
    { new: true }, // повертаємо оновлений документ
  );
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};
