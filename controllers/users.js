const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');

const { JWT_SECRET_KEY } = process.env;
const MONGO_KEY_CODE = 11000;
// NODE_ENV,
//
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// Регистрация нового пользователя
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Нет пользователя с таким id' });
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then(({ _id }) => {
      res.send({
        _id,
        name,
        about,
        avatar,
        email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные для создания пользователя',
        );
      } else if (err.name === 'MongoError' && err.code === MONGO_KEY_CODE) {
        throw new ConflictError(`Пользователь с email «${email}» уже существует`);
      }
    })
    .catch(next);
};

// Обновление информации пользователя
module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

// Обновление аватара пользователя
module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new BadRequestError({ message: `Указаны некорректные данные при обновлении аватара: ${err.message}` });
    })
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET_KEY,
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(next);
};
