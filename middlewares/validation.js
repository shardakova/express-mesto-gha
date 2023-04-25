const HttpError = require('../utils/HttpError');

function validation(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new HttpError(err, 400));
    }
  };
}

module.exports = validation;
