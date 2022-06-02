// Импорты пакетов
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const router = require('./routes/users');
const routerCards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { reg } = require('./utils/reg');
const errHandler = require('./middlewares/error-handler');
// Установка порта

const {
  PORT = 3000,
} = process.env;

// Подключению к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb');

// Установка точки входа

const app = express();

app.use(cookieParser());
app.use(helmet());
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }).required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(reg)),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }).required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/', auth, router);

app.use('/', auth, routerCards);

app.use('*', (_, res) => res.status(404).send({
  message: 'Запрашиваемая страница не найдена',
}));

app.use(errors());

app.use(errHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
