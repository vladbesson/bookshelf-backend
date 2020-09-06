const Books = require('../models/book');
const NotFoundError = require('../errors/not-found-err');

module.exports.getBooks = (req, res, next) => {
  Books.find({})
    .then((books) => res.send({ data: books }))
    .catch(next);
};

module.exports.getBookById = async (req, res, next) => {
  await Books.findById(req.params.id)
    .populate('author')
    .orFail(new NotFoundError('Нет такого пользователя'))
    .then((book) => res.send({ data: book }))
    .catch(next);
};

module.exports.createBook = (req, res, next) => {
  const { name, cover, author, link } = req.body;

  Books.create({ name, cover, author, link, owner: req.user._id })
    .then((book) => res.send({ data: book }))
    .catch(next);
};
