const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { handleError } = require('./middlewares/handleError');
const regex = require('./utils/constants');
const NotFound = require('./errors/NotFound');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('then');
  })
  .catch(() => {
    console.log('catch');
  });

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(3).max(30),
        about: Joi.string().min(3).max(30),
        avatar: Joi.string().pattern(regex),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
      })
      .unknown(true),
  }),
  createUser,
);

app.use(auth);

app.use('/users', userRoute);
app.use('/cards', cardRoute);

app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(handleError);

app.listen(PORT);
