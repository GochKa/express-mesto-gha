const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { reg } = require('../utils/reg');
const {
  getCard,
  createCard,
  deleatCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.get('/', getCard);

cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(reg)),
  }),
}), createCard);

cards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

cards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

cards.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleatCard);

module.exports = cards;
