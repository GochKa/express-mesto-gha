// Импорты пакетов
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const errHandler = require('./middlewares/error-handler');

const NotFoundError = require('./errors/not-found');
const users = require('./routes/users');
const cards = require('./models/cards');
const { validateUser, validateLogin } = require('./middlewares/validate');
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

app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);

app.use('/', auth, users);
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
