const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { reg } = require('../utils/reg');
// Импорт из контроллера
const {
  getUsers, getUser, patchUser, patchAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(reg)).required(),
  }),
}), patchAvatar);

module.exports = router;
