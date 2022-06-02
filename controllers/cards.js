const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');

const Card = require('../models/cards');

// Получение карточки
const getCard = (_, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// Создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Получены некоректные данные для создания карточки'));
      }
      return next(err);
    });
};

// Удаление карточки по id'шнику
const deleatCard = (req, res, next) => {
  const deleatCardHeandler = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then(() => res.send({ message: 'Удаление прошло успешно' }))
      .catch((err) => {
        if (err.name === 'CastError') {
          return next(new BadRequestError('Передан неверный Id карточки'));
        }
        return next(err);
      });
  };

  Card.findById(req.params.cardId)
    .then((cardInfo) => {
      if (!cardInfo) {
        return next(new NotFoundError('Карточка с указанным ID не найдена в базе'));
      }

      if (req.user._id !== cardInfo.owner.toString()) {
        return next(new ForbiddenError('Недостаточно прав для совершения этого действия'));
      }
      return deleatCardHeandler();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан неверный Id карточки'));
      }
      return next(err);
    });
};

// Лайк карточки
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('В базе данных такой карточки нет'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некотректный Id карточки'));
      }
      return next(err);
    });
};

// Дизлайк карточки
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('В базе данных такой карточки нет'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некотректный Id карточки'));
      }
      return next(err);
    });
};

// Экспорт
module.exports = {
  getCard,
  createCard,
  deleatCard,
  likeCard,
  dislikeCard,
};
