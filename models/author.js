const mongoose = require('mongoose');
const validator = require('validator');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  dateOfBirth: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  dateOfDeath: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  country: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  books: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'book',
    default: [],
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
});

module.exports = mongoose.model('author', authorSchema);
