const routerCards = require('express').Router();

const { cardDataValidator } = require('../validators/card');

// Импорт из контроллера
const {
  getCard, createCard, deleatCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/', getCard);
routerCards.post('/', cardDataValidator, createCard);
routerCards.delete('/:cardId', deleatCard);
routerCards.put('/:cardId/likes', likeCard);
routerCards.delete('/:cardId/likes', dislikeCard);

module.exports = routerCards;
