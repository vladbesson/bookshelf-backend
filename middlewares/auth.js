const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // проверить что authorization есть
  // и authorization.startsWith('Bearer ') тоже true

  const token = authorization.replace('Bearer ', '');
  let payload;

  // это нужно засунуть в try catch,
  // в catch выкидывать Unauthorized (401) ошибку
  const { JWT_SECRET = 'secret-key' } = process.env;
  payload = jwt.verify(token, JWT_SECRET);

  req.user = payload;
  next();
};
