const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const DuplicationError = require('../errors/duplication-err');

const JWT_SECRET = 'cdc42cb1da7509ed6100b46348a3444b52fa1e611d2888a33a629ea84b7bfde9';

function sendError(err, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new ValidationError('Переданы некорректные данные пользователя'));
  } else if (err.name === 'NotFound') {
    next(new NotFoundError('Пользователь не найден'));
  } else if (err.code === 11000) {
    next(new DuplicationError('Пользователь с такими данными уже существует'));
  } else {
    next(err);
  }
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => sendError(err, next));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => sendError(err, next));
};

module.exports.getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => sendError(err, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const data = {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      };
      res.send({ data });
    })
    .catch((err) => sendError(err, next));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      const data = {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      };
      res.send({ data });
    })
    .catch((err) => sendError(err, next));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => sendError(err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new IncorrectDataError('Неверные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new IncorrectDataError('Неверные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          const data = {
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          };
          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            });
          res.send({ data });
        });
    })
    .catch((err) => sendError(err, next));
};
