const mongoose = require('mongoose');
const validator = require('validator');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  cover: {
    type: String,
    required: true,
    validate: {
      validator(valid) {
        return validator.isURL(valid);
      },
    },
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(valid) {
        return validator.isURL(valid);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'author',
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('book', bookSchema);
