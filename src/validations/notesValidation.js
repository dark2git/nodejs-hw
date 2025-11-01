// src/validations/notesValidation.js

import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// приведемо до lowercase для нечутливої до регістру валідації
const lowerTags = TAGS.map((t) => t.toLowerCase());

// Схема для отримання списку нотаток з пагінацією
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .lowercase()
      .valid(...lowerTags)
      .optional(),
    search: Joi.string().trim().allow(''),
    sortBy: Joi.string()
      .valid('_id', 'title', 'tag', 'createdAt', 'updatedAt')
      .default('_id'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  }),
};

// Схема для перевірки параметра noteId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// Додаємо схему для params (category)
export const categoryParamSchema = {
  [Segments.PARAMS]: Joi.object({
    category: Joi.string()
      .lowercase()
      .valid(...lowerTags)
      .required(),
  }),
};

// Схема для створення нової нотатки
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().trim().allow('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .valid(...TAGS) //strict validation with original case
      .messages({
        'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      }),
  }),
};

// Схема для оновлення нотатки — поєднуємо params + body
export const updateNoteSchema = {
  ...noteIdSchema,
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().trim().allow(''),
    tag: Joi.string().valid(...TAGS), //strict validation with original case
  }).min(1), // хоча б одне поле має бути присутнім
};
