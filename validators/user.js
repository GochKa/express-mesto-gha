const { celebrate, Joi } = require('celebrate');

module.exports.profileDataValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .error(new Joi.ValidationError('Некоректное имя')),
    about: Joi.string()
      .required()
      .min(2)
      .max(30)
      .error(new Joi.ValidationError('Некоректное описание')),
  }).unknown(true),
});

module.exports.avatarDataValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .error(new Joi.ValidationError('Некоректная ссылка')),
  }).unknown(true),
});
