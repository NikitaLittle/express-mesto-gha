const router = require('express').Router();
const { signupValidation } = require('../middlewares/validation');
const { createUser } = require('../controllers/users');

router.post('/', signupValidation, createUser);

module.exports = router;
