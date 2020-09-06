const Authors = require('../models/author');
const NotFoundError = require('../errors/not-found-err');

module.exports.getAuthors = (req, res, next) => {
  Authors.find({})
    .then((authors) => res.send({ data: authors }))
    .catch(next);
};

module.exports.getAuthorById = async (req, res, next) => {
  await Authors.findById(req.params.id)
    .populate('books')
    .orFail(new NotFoundError('Нет такого пользователя'))
    .then((author) => res.send({ data: author }))
    .catch(next);
};

module.exports.createAuthor = (req, res, next) => {
  const {
    name,
    dateOfBirth,
    dateOfDeath,
    country,
    link,
  } = req.body;

  Authors.create({ name, dateOfBirth, dateOfDeath, country, link })
    .then((author) => res.send({ data: author }))
    .catch(next);
};
