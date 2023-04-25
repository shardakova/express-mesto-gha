const express = require('express');
const auth = require('../middlewares/auth');
const cards = require('./cards');
const users = require('./users');

const router = express.Router();

router.use('/', auth, cards);
router.use('/', auth, users);

module.exports = router;
