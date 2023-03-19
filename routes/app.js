const router = require('express').Router();

function showWrongPathError(req, res) {
  return res.status(404).send({ message: 'Страница не найдена' });
}

router.get('/', showWrongPathError);
router.delete('/', showWrongPathError);
router.post('/', showWrongPathError);
router.put('/', showWrongPathError);
router.patch('/', showWrongPathError);

module.exports = router;
