const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const findUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы некорректные данные в методы поиска пользователя.'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        res.status(201).send(userWithoutPassword);
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new Conflict('Переданы некорректные данные в методы создания пользователя'));
        } else if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequest(err.message));
        } else {
          next(err);
        }
      });
  });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  console.log(req.body);

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(err.message));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound('Пользователь с указанным _id не найден.'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(err.message));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(NotFound('Пользователь с указанным _id не найден.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.status(200).send({ token });

      // res
      //   .status(200)
      //   .cookie('token', token, {
      //     maxAge: 604800000, // '7d'
      //     httpOnly: true,
      //     sameSite: 'None',
      //   })
      //   .send(user._id);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  findUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
