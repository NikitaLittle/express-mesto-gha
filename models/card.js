const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: ObjectId,
      ref: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = model('card', cardSchema);