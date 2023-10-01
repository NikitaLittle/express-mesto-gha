const mongoose = require('mongoose');
const User = require('../models/user');
const {
  ok, created, badRequest, notFound, internalServerError,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(ok).send(users);
    })
    .catch(() => {
      res.status(internalServerError).send({ message: 'Ошибка по умолчанию.' });
    });
};

const findUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId).orFail()
    .then((user) => {
      res.status(ok).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(badRequest).send({ message: 'Переданы некорректные данные в методы поиска пользователя.' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(internalServerError).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(created).send(newUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequest).send({ message: err.message });
      } else {
        res.status(internalServerError).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true }).orFail()
    .then((updatedUser) => {
      res.status(ok).send(updatedUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequest).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(internalServerError).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true }).orFail()
    .then((updatedUser) => {
      res.status(ok).send(updatedUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequest).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(internalServerError).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports = {
  getUsers,
  findUserById,
  createUser,
  updateUser,
  updateAvatar,
};
