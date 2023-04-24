const express = require('express');
const cards = require('./cards');
const users = require('./users');

const router = express.Router();

router.use('/', cards);
router.use('/', users);

module.exports = router;
