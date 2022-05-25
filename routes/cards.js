const router = require('express').Router();

// Импорт из контроллера
const {
  getCard, createCard, deleatCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCard);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleatCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
