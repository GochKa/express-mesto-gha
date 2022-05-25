// Импорты пакетов
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Установка порта
const { PORT = 3000 } = process.env;

// Подключению к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb');

// Установка точки входа
const app = express();

//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, _, next) => {
  req.user = {
    _id: '628d68277b36dbe8a62834f8',
  };

  next();
});

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use('*', (_, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
