const signin = require('express').Router();

const { login } = require('../controllers/users');

signin.post('/', login);

module.exports = signin;
