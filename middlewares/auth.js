const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized');

const { JWT_SECRET } = process.env;

module.exports = (req, __, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Для доступа необходима авторизация');
  }

  const token = authorization.replace('Bearer', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Для доступа необходима авторизация');
  }
  req.user = payload;
  next();
};
