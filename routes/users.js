const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
  getMyInfo,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getMyInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^http[s]?:\/\/[a-zA-Z0-9-._~:/?#[@!$&'()*+,;\]=]+\.[a-zA-Z0-9-._~:/?#[@!$&'()*+,;\]=]+$/),
  }),
}), updateAvatar);

module.exports = router;
