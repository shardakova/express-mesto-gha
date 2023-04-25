const jwt = require('jsonwebtoken');
const HttpError = require('../utils/HttpError');

function auth(req, res, next) {
  try {
    req.user = jwt.verify(req.cookies.token, process.env.JWT_TOKEN_SECRET);
    return next();
  } catch (err) {
    return next(new HttpError('Invalid JWT Token', 401));
  }
}

module.exports = auth;
