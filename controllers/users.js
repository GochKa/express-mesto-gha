const User = require('../models/user');

// Создание нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некоректные name, about или avatar' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

// Получение информации о нужном пользователе
const getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

//
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Id пользователя не верный' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

// Обновление информации пользователя
const patchUser = (req, res) => {
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
        return res.status(400).send({ message: 'Некоректные name или about' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

// Обновление аватара пользователя
const patchAvatar = (req, res) => {
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
        return res.status(400).send({ message: "Некоректная ссыдка avatar'a" });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

// Экспорт
module.exports = {
  createUser,
  getUsers,
  getUser,
  patchUser,
  patchAvatar,
};
