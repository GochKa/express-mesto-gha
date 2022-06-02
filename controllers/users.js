const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');

const { JWT_SECRET = 'secret-code' } = process.env;
// Регистрация нового пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, paswword,
  } = req.body;
  if (!email || !paswword) {
    return next(new BadRequestError('Введены неверные email или password'));
  }
  return bcrypt.hash(paswword, 10)
    .then((hash) => User.create({
      name, about, avatar, email, paswword: hash,
    })
      .then((user) => {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email,
        });
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некоректные данные пользователя'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегестрирован'));
      }
      return next(err);
    });
};

// Получение информации о пользователях
const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// Получение информации о конкретном пользователя
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с таким id не найден в базе'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Id пользователя не верный'));
      }
      return next(err);
    });
};

// Обновление информации пользователя
const patchUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некоректные name или about'));
      }
      return next(err);
    });
};

// Обновление аватара пользователя
const patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некоректная ссылка avatar'));
      }
      return next(err);
    });
};

// Логин пользователя
const login = (req, res, next) => {
  const { email, paswword } = req.params;

  if (!email || !paswword) {
    return next(new BadRequestError('Неверно заполнено поле email или password'));
  }
  return User.findUserByCredentials(email, paswword)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch(next);
};

//
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Переданный _id некорректный'));
      }
      return next(err);
    });
};

// Экспорт
module.exports = {
  createUser,
  getUsers,
  getUser,
  patchUser,
  patchAvatar,
  login,
  getCurrentUser,
};
