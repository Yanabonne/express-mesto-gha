const jwt = require('jsonwebtoken');
const IncorrectDataError = require('../errors/incorrect-data-err');

const JWT_SECRET = 'cdc42cb1da7509ed6100b46348a3444b52fa1e611d2888a33a629ea84b7bfde9';

const handleAuthError = () => {
  throw new IncorrectDataError('Необходима авторизация');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError();
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
