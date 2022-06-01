// Импорты пакетов
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundErr = require('./errors/not-found-err');
// Установка порта
const { PORT = 3000 } = process.env;

// Подключению к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb');

// Установка точки входа
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (_, __, next) => next(new NotFoundErr('Запрашиваемая страница не найдена')));

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
