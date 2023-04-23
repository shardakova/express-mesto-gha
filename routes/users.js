const express = require('express');
const controller = require('../contollers/users');

const router = express.Router();

router.get('/users', controller.getUsers);
router.post('/users', controller.createUser);
router.get('/users/:id', controller.getUser);
router.patch('/users/me', controller.updateUser);
router.patch('/users/me/avatar', controller.updateAvatar);

module.exports = router;
