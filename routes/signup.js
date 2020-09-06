const signup = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadReq = require('../errors/bad-req');

const { createUser } = require('../controllers/users');

signup.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.required().custom((value) => {
      if (!validator.isURL(value)) {
        throw new BadReq('В поле \'аватар\' вставьте ссылку на ваше фото');
      } else { return value; }
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = signup;
