const express = require('express');
const controller = require('../contollers/cards');

const router = express.Router();

router.get('/cards', controller.getCards);
router.post('/cards', controller.createCard);
router.delete('/cards/:id', controller.deleteCard);
router.put('/cards/:id/likes', controller.addLike);
router.delete('/cards/:id/likes', controller.removeLike);

module.exports = router;
