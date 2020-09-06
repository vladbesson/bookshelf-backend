const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadReq = require('../errors/bad-req');
const Unauthorized = require('../errors/unauthorized');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = async (req, res, next) => {
  await User.findById(req.params.id)
    .populate('books')
    .orFail(new NotFoundError('Нет такого пользователя'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, avatar, email, password: hash,
      })
        .then((user) => res.send({
          name: user.name, avatar: user.avatar, email: user.email,
        }))
        .catch((err) => next(new BadReq(err.message)));
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
    .catch((err) => next(new Unauthorized(err.message)));
};
