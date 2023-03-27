const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

function sendError(err, res) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res
      .status(400)
      .send({ message: 'Переданы некорректные данные пользователя' });
  }
  if (err.name === 'NotFound') {
    return res.status(404).send({ message: 'Пользователь не найден' });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка' });
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => sendError(err, res));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => sendError(err, res));
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
    .catch((err) => sendError(err, res));
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
    .catch((err) => sendError(err, res));
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
    .catch((err) => sendError(err, res));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
