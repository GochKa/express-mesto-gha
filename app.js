// Импорты пакетов
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const router = require('./routes/users');
const routerCards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
// const { reg } = require('./utils/reg');
const errHandler = require('./middlewares/error-handler');
// Установка порта
// celebrate, Joi,
const {
  PORT = 3000,
} = process.env;

// Подключению к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb');

// Установка точки входа

const app = express();

app.use(cookieParser());
app.use(helmet());

app.post('/signin', login);

app.post('/signup', createUser);

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
