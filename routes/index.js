const router = require('express').Router();
const userRoute = require('./users');
const cardRoute = require('./cards');
const signinRoute = require('./signin');
const signupRoute = require('./signup');
const { auth } = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');

router.use('/signin', signinRoute);
router.use('/signup', signupRoute);

router.use('/users', auth, userRoute);
router.use('/cards', auth, cardRoute);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
