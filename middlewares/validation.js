const { celebrate, Joi } = require('celebrate');
const linkRegex = require('../utils/constants');

const validation = {
  signinValidation: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),

  signupValidation: celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(3).max(30),
        about: Joi.string().min(3).max(30),
        avatar: Joi.string().pattern(new RegExp(linkRegex)),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),

  findUserByIdValidation: celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().required().max(24),
    }),
  }),

  updateUserValidation: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),

  updateAvatarValidation: celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(new RegExp(linkRegex)),
    }),
  }),

  createCardValidation: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(new RegExp(linkRegex)),
    }),
  }),

  deleteCardValidation: celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().required(),
    }),
  }),

  likeCardValidation: celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().required(),
    }),
  }),
};

module.exports = validation;
