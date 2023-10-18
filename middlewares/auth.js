const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};

module.exports = {
  auth,
};
