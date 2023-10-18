const mongoose = require('mongoose');
const validator = require('validator');

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено.'],
      minlength: [2, 'Минимальная длина поля "name" - 2.'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" должно быть заполнено.'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL поля "link".',
      },
    },
    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [ObjectId],
      ref: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: false },
);

module.exports = model('card', cardSchema);
