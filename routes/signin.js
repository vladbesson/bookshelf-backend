const signin = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { login } = require('../controllers/users');

signin.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

module.exports = signin;
