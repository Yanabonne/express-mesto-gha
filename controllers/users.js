const User = require("../models/user");

function sendError(err) {
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .send({ message: "Переданы некорректные данные пользователя" });
  } else if (err.name === "NotFound") {
    return res.status(404).send({ message: "Пользователь не найден" });
  } else {
    return res.status(500).send({ message: "Неизвестная ошибка" });
  }
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => sendError(err));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => sendError(err));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => sendError(err));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => sendError(err));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => sendError(err));
};
