const books = require('express').Router();
const auth = require('../middlewares/auth');

const { getBooks, getBookById, createBook } = require('../controllers/books');

books.get('/', getBooks);
books.get('/:id', getBookById);
books.post('/', auth, createBook);

module.exports = books;
