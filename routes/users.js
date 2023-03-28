const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
