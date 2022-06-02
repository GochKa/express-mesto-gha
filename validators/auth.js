const { celebrate, Joi } = require('celebrate');

module.exports.signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .error(new Joi.ValidationError('Некоректный email')),
    password: Joi.string()
      .required()
      .min(8)
      .error(new Joi.ValidationError('Некректный пароль')),
  }).unknown(true),
});

module.exports.signupValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .error(new Joi.ValidationError('Некоректный email')),
    password: Joi.string()
      .required()
      .min(8)
      .error(new Joi.ValidationError('Некректный пароль')),
    name: Joi.string()
      .min(2)
      .max(30)
      .error(new Joi.ValidationError('Некоректное имя')),
    about: Joi.string()
      .min(2)
      .max(30)
      .error(new Joi.ValidationError('некоректное описание')),
    avatar: Joi.string()
      .error(new Joi.ValidationError('Неректная ссылка')),
  }).unknown(true),
});
