const Card = require('../models/cards');

// Получение карточки
const getCard = (_, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

// Создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

// Удаление карточки по id'шнику
const deleatCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с таким Id не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некотректный Id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

// Лайк карточки
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'В базе данных такой карточки нет' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некотректный Id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

// Дизлайк карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'В базе данных такой карточки нет' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некотректный Id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

// Экспорт
module.exports = {
  getCard,
  createCard,
  deleatCard,
  likeCard,
  dislikeCard,
};
