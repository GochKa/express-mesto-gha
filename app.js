// Импорты пакетов
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const errHandler = require('./middlewares/error-handler');
const reg = require('./utils/reg');
const NotFoundError = require('./errors/not-found');
const router = require('./routes/users');
const cards = require('./models/cards');

// Установка порта
const {
  PORT = 3000,
} = process.env;

// Подключению к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb');

// Установка точки входа

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(reg),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/', auth, router);
app.use('/', auth, cards);

app.use(() => {
  throw new NotFoundError({ message: 'Запрашиваемая страницы не найдена' });
});

app.use(errors());

app.use(errHandler);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.message);
    return;
  }
  res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
