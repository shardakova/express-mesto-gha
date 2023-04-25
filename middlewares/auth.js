const jwt = require('jsonwebtoken');
const config = require('../config');
const { UnauthorizedError } = require('../utils/errors');

function auth(req, res, next) {
  try {
    if (!req.cookies.token) {
      return next(new UnauthorizedError());
    }
    req.user = jwt.verify(req.cookies.token, config.JWT_TOKEN_SECRET);
    return next();
  } catch (err) {
    return next(new UnauthorizedError());
  }
}

module.exports = auth;
