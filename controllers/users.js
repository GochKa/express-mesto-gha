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
    throw new BadRequestError('Введены некоректные данные пользователя');
  }

  bcrypt.hash(paswword, 10)
    .then((hash) => User.create({
      name, about, avatar, email, paswword: hash,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некоректные данные пользователя');
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже зарегестрирован');
      }
    })
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch(next);
};

// Получение информации о пользователях
const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
};

// Получение информации о конкретном пользователя
const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь с таким id не найден в базе');
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Id пользователя не верный');
      }
    })
    .catch(next);
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
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Некоректные name или about');
      }
    })
    .catch(next);
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
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Некоректная ссылка avatar');
      }
    })
    .catch(next);
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
  const usersId = req.user._id;
  User.findById(usersId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(data);
    })
    .catch(next);
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
