const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

const { JWT_SECRET = 'secret-code' } = process.env;

module.exports = (req, _, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};
