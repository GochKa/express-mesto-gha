const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');

const Card = require('../models/cards');

// Получение карточки
const getCard = (_, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// Создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(next);
};

// Удаление карточки по id'шнику
const deleatCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.deleteCardAsOwner({ cardId, userId: req.user._id })
    .then((data) => {
      if (!data) {
        throw new BadRequestError('Карточка не найдена');
      }
      res.send(data);
    })
    .catch(next);
};
// Лайк карточки
const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('В базе данных такой карточки нет'));
      }
      return res.send(card);
    })
    .catch(next);
};

// Дизлайк карточки
const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(

    cardId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('В базе данных такой карточки нет'));
      }
      return res.send(card);
    })
    .catch(next);
};

// Экспорт
module.exports = {
  getCard,
  createCard,
  deleatCard,
  likeCard,
  dislikeCard,
};
