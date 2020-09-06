const books = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const { default: validator } = require('validator');
const auth = require('../middlewares/auth');

const { getBooks, getBookById, createBook } = require('../controllers/books');
const BadReq = require('../errors/bad-req');

books.get('/', getBooks);

books.get('/:id', getBookById);

books.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    cover: Joi.required().custom((value) => {
      if (!validator.isURL(value)) {
        throw new BadReq('В поле \'cover\' вставьте ссылку');
      } else { return value; }
    }),
    link: Joi.required().custom((value) => {
      console.log("value", value);
      if (!validator.isURL(value)) {
        throw new BadReq('В поле \'link\' вставьте ссылку');
      } else { return value; }
    }),
  }).unknown(true),
}), auth, createBook);

module.exports = books;
