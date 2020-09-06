const authors = require('express').Router();
const {
  getAuthors, getAuthorById, createAuthor,
} = require('../controllers/authors');

authors.get('/', getAuthors);
authors.get('/:id', getAuthorById);
authors.post('/', createAuthor);

module.exports = authors;
