const routerCards = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { reg } = require('../utils/reg');

// Импорт из контроллера
const {
  getCard, createCard, deleatCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/', getCard);

routerCards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(reg)),
  }),
}), createCard);

routerCards.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleatCard);

routerCards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

routerCards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = routerCards;
