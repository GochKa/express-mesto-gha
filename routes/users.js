const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  patchUser,
  patchAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { reg } = require('../utils/reg');

users.get('/', getUsers);

users.get('/me', getCurrentUser);

users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(reg)).required(),
  }),
}), patchAvatar);

module.exports = users;
