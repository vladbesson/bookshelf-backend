const Books = require('../models/book');

module.exports.getBooks = (req, res) => {
  Books.find({})
    .then((books) => res.send({ data: books }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getBookById = async (req, res) => {
  await Books.findById(req.params.id)
    .populate('author')
    .orFail(() => res.status(404).send({ message: 'Запрашиваемой книги не существует' }))
    .then((book) => res.send({ data: book }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createBook = (req, res) => {
  const { name, cover, author, link } = req.body;

  Books.create({ name, cover, author, link, owner: req.user._id })
    .then((book) => res.send({ data: book }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Невалидные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
