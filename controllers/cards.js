const Card = require('../models/card');

const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');
const IncorrectDataError = require('../errors/incorrect-data-err');

function sendError(err, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new ValidationError('Переданы некорректные данные карточки'));
  }
  if (err.name === 'NotFound') {
    next(new NotFoundError('Карточка не найдена'));
  }
  if (err.name === 'TypeError') {
    next(new IncorrectDataError('Переданы неверные данные'));
  }
  if (err.name === 'InternalServerError') {
    next(new ServerError('На сервере произошла ошибка'));
  }
  next(err);
}

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => sendError(err, next));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => sendError(err, next));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner !== req.user._id) {
        throw new IncorrectDataError('Вы не можете удалить чужую карточку');
      }
      res.send({ data: card });
    })
    .catch((err) => sendError(err, next));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => sendError(err, next));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => sendError(err, next));
};
