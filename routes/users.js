const users = require('express').Router();

const {
  getUsers, getUserById,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:id', getUserById);

module.exports = users;
