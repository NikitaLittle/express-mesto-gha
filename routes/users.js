const router = require('express').Router();
const {
  getUsers, findUserById, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const { findUserByIdValidation, updateUserValidation, updateAvatarValidation } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', findUserByIdValidation, findUserById);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
