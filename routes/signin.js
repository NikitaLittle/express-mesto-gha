const router = require('express').Router();
const { signinValidation } = require('../middlewares/validation');
const { login } = require('../controllers/users');

router.post('/', signinValidation, login);

module.exports = router;
