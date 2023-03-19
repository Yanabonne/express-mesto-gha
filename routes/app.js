const router = require('express').Router();

function showWrongPathError(req, res) {
  return res.status(500).send({ message: 'Неизвестная ошибка' });
}

router.get('/', showWrongPathError);
router.delete('/', showWrongPathError);
router.post('/', showWrongPathError);
router.put('/', showWrongPathError);
router.patch('/', showWrongPathError);

module.exports = router;
