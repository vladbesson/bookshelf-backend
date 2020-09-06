const signup = require('express').Router();

const { createUser } = require('../controllers/users');

signup.post('/', createUser);

module.exports = signup;
