const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');
const IncorrectDataError = require('../errors/incorrect-data-err');

const JWT_SECRET = 'cdc42cb1da7509ed6100b46348a3444b52fa1e611d2888a33a629ea84b7bfde9';

function sendError(err) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new ValidationError('Переданы некорректные данные пользователя'));
  }
  if (err.name === 'NotFound') {
    next(new NotFoundError('Пользователь не найден'));
  }
  if (err.name === 'TypeError') {
    next(new IncorrectDataError('Переданы неверные данные'));
  }
  if (err.name === 'InternalServerError') {
    next(new ServerError('На сервере произошла ошибка'));
  }
  next(err);
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => sendError(err));
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => sendError(err));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => sendError(err));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => sendError(err));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => sendError(err));
};

module.exports.login = (req, res) => {
  const { email } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => sendError(err));
};
