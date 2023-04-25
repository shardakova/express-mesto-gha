const express = require('express');
const { celebrate } = require('celebrate');
const controller = require('../contollers/users');
const validationSchemas = require('../utils/validationSchemas');

const router = express.Router();

router.get('/users', controller.getUsers);
router.get('/users/me', controller.getUser);
router.get('/users/:id', celebrate(validationSchemas.objectIdParam), controller.getUser);
router.patch('/users/me', celebrate(validationSchemas.updateUser), controller.updateUser);
router.patch('/users/me/avatar', celebrate(validationSchemas.updateAvatar), controller.updateAvatar);

module.exports = router;
