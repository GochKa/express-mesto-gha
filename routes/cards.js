const router = require('express').Router();

const { cardDataValidator } = require('../validators/card');

// Импорт из контроллера
const {
  getCard, createCard, deleatCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCard);
router.post('/', cardDataValidator, createCard);
router.delete('/:cardId', deleatCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
