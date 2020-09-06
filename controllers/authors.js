const Authors = require('../models/author');

module.exports.getAuthors = (req, res) => {
  Authors.find({})
    .then((authors) => res.send({ data: authors }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getAuthorById = async (req, res) => {
  await Authors.findById(req.params.id)
    .populate('books')
    .orFail(() => res.status(404).send({ message: 'Запрашиваемого автора не существует' }))
    .then((author) => res.send({ data: author }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createAuthor = (req, res) => {
  const {
    name,
    dateOfBirth,
    dateOfDeath,
    country,
    link,
  } = req.body;

  Authors.create({ name, dateOfBirth, dateOfDeath, country, link })
    .then((author) => res.send({ data: author }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};
