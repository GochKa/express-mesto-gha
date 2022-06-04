// Импорт необходимых пакетов
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');

// Импорт необходимых модулей
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found');
const regEx = require('./utils/reg');

// Пожкдючение к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb');

// Порт и подулючение приложения к express
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Логин
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// Регистрация
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regEx),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// Подключение авторизации
app.use(auth);

// Основные страницы, защищенные авторизацией
app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/cards'));

// Переход по несуществующему пути
app.use('*', auth, (_, __, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

app.use(errors());

// Контроль несуществующей ошибки
app.use((err, _, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

// Запуск сервера
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
