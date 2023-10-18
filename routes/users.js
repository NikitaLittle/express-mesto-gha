const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, findUserById, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const regex = require('../utils/constants');

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:userId', findUserById);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(regex),
    }),
  }),
  updateAvatar,
);

module.exports = router;
