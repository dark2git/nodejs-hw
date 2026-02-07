// src/validations/authValidation.js

import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// Схема валідації для запиту на скидання пароля (відправка листа на email)
export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
  }),
};

// Схема валідації для скидання пароля (власне зміна пароля)
export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    password: Joi.string().min(8).required(),
    token: Joi.string().required(),
  }),
};

//схема валідації для отримання сторінки скидання пароля
export const getResetPasswordPageSchema = {
  [Segments.QUERY]: Joi.object({
    token: Joi.string().required(),
  }),
};
