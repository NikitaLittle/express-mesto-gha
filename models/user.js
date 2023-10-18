const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/Unauthorized');

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2.'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "about" - 2.'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL поля "avatar".',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено.'],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v, {
          allow_utf8_local_part: true,
        }),
        message: '',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено.'],
      select: false,
    },
  },
  { versionKey: false, timestamps: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
      }
      bcrypt.compare(password, user.password).then((mathed) => {
        if (!mathed) {
          throw new Unauthorized('Неправильные почта или пароль');
        }
        return user;
      });
    });
};

module.exports = model('user', userSchema);
