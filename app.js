// Импорты пакетов
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');

const router = require('./routes/users');
const routerCards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found');
const { reg } = require('./utils/reg');
const { errorHandler } = require('./middlewares/error-handler');

// Установка порта
const { PORT = 3000 } = process.env;

// Подключению к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Установка точки входа
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }).required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(reg)),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }).required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', auth, router);

app.use('/cards', auth, routerCards);

app.use('*', auth, (_, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
