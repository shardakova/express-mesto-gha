const express = require('express');
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const cards = require('./cards');
const users = require('./users');
const validationSchemas = require('../utils/validationSchemas');
const usersController = require('../contollers/users');
const { NotFoundError } = require('../utils/errors');

const router = express.Router();

router.post('/signin', celebrate(validationSchemas.login), usersController.login);
router.post('/signup', celebrate(validationSchemas.createUser), usersController.createUser);

router.use('/', auth, cards);
router.use('/', auth, users);

router.use((req, res, next) => next(new NotFoundError()));

module.exports = router;
