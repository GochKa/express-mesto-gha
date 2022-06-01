const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized');

module.exports = (req, __, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Для доступа необходима авторизация');
  }

  // const token = authorization.replace('Bearer', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
    req.user = payload;
    next();
  } catch (err) {
    throw new UnauthorizedError('Для доступа необходима авторизация');
  }
};
