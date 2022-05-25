const router = require('express').Router();

// Импорт из контроллера
const {
  getUsers, getUser, createUser, patchUser, patchAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.patch('/users/me', patchUser);
router.patch('/users/me/avatar', patchAvatar);

module.exports = router;
