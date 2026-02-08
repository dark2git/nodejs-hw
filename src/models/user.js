// src/models/user.js

import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true, //унікальний ідентифікатор користувача.
      required: true, // обов'язкове поле
      trim: true,
    },
    password: {
      type: String,
      required: true, // обов'язкове поле
      minlength: 8, // мінімальна довжина пароля
    },
    // avatar
    avatar: {
      type: String,
      required: false,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

// Перевизначаємо метод toJSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
//Тепер, коли ми відправляємо користувача через res.json(), поле password автоматично видаляється.

export const User = model('User', userSchema);
