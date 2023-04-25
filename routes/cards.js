const express = require('express');
const { celebrate } = require('celebrate');
const controller = require('../contollers/cards');
const validationSchemas = require('../utils/validationSchemas');

const router = express.Router();

router.get('/cards', controller.getCards);
router.post('/cards', celebrate(validationSchemas.createCard), controller.createCard);
router.delete('/cards/:id', celebrate(validationSchemas.objectIdParam), controller.deleteCard);
router.put('/cards/:id/likes', celebrate(validationSchemas.objectIdParam), controller.addLike);
router.delete('/cards/:id/likes', celebrate(validationSchemas.objectIdParam), controller.removeLike);

module.exports = router;
