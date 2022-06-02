const { celebrate, Joi } = require('celebrate');

module.exports.cardDataValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .error(new Joi.ValidationError('Некоректный email')),
    link: Joi.string()
      .required()
      .error(new Joi.ValidationError('Некоректная ссылка')),
  }).unknown(true),
});
