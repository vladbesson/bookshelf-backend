const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const cors = require('cors')

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { users, books, authors, signin, signup } = require('./routes');

require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(requestLogger);
app.use(cookieParser());

app.use('/users', users);
app.use('/authors', authors);
app.use('/books', books);
app.use('/signup', signup);
app.use('/signin', signin);

app.all('/*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  console.log("err", err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

mongoose.connect('mongodb://localhost:27017/bookshelf', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  // eslint-disable-next-line no-console
  .then(() => { console.log('DB on'); })
  // eslint-disable-next-line no-console
  .catch(() => { console.log('DB off'); });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
