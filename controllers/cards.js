const Card = require('../models/cards');
const BadRequestErr = require('../errors/bad-request');
const NotFoundErr = require('../errors/not-found-err');
const ForbiddenErr = require('../errors/forbidden');

// Получение карточки
const getCard = (_, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

// Создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr('Некотректные поля name или link');
      }
      next(err);
    });
};

// Удаление карточки по id'шнику
const deleatCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Запрашиваемая карточка не найдена');
      } if (req.user._id !== JSON.stringify(card.owner).slice(1, -1)) {
        throw new ForbiddenErr('Невозможно удалиь чужую карточку');
      } else {
        return card.remove()
          .then(() => res.send({ data: card }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Неверный id карточки');
      }
      next(err);
    });
};

// Лайк карточки
const likeCard = (req, res, next) => {
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
        throw new NotFoundErr('В базе данных такой карточки нет');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Неверный id карточки');
      }
      next(err);
    });
};

// Дизлайк карточки
const dislikeCard = (req, res, next) => {
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
        throw new NotFoundErr('В базе данных такой карточки нет');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Неверный id карточки');
      }
      next(err);
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
