const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = async (req, res) => {
  await User.findById(req.params.id)
    .populate('books')
    .orFail(() => res.status(404).send({ message: 'Запрашиваемого юзера не существует' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, avatar, email, password,
  } = req.body;
  if ((password === undefined) || (password.trim().length < 8)) {
    res.status(400).send({ message: 'Невалидные данные' });
    return;
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, avatar, email, password: hash,
      })
        .then((user) => res.send({
          name: user.name, avatar: user.avatar, email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Невалидные данные' });
          } else if (err.name === 'MongoError') {
            res.status(409).send({ message: 'Такой пользователь уже существует' });
          } else {
            res.status(500).send({ message: 'На сервере произошла ошибка' });
          }
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SECRET = 'secret-key' } = process.env;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 86400 * 7,
          httpOnly: true,
          sameSite: true,
        });
      res.send({ message: 'Авторизация прошла успешна. Токен записан в куки' });
    })
    .catch(next);
};
