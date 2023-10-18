const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, findUserById, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const regex = require('../utils/constants');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  }),
  findUserById,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(regex),
    }),
  }),
  updateAvatar,
);

module.exports = router;
