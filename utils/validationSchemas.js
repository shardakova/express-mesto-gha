const Joi = require('joi');

function UrlCustomValidator(value, helpers) {
  let parsedUrl;
  try {
    parsedUrl = new URL(value);
  } catch (err) {
    return helpers.error('any.invalid');
  }
  const isValidProtocol = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  if (!isValidProtocol) {
    return helpers.error('any.invalid');
  }
  return value;
}

const login = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const createUser = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().trim().min(2).max(30),
    about: Joi.string().trim().min(2).max(30),
    avatar: Joi.string().custom(UrlCustomValidator),
  }),
};

const updateUser = {
  body: Joi.object({
    name: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(30),
    about: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(30),
  }),
};

const updateAvatar = {
  body: Joi.object({
    avatar: Joi.string().custom(UrlCustomValidator),
  }),
};

const createCard = {
  body: Joi.object({
    name: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(30),
    link: Joi.string().required().custom(UrlCustomValidator),
  }),
};

const objectIdParam = {
  params: Joi.object({
    id: Joi.string().required().hex().length(24),
  }),
};

module.exports = {
  login,
  createUser,
  updateUser,
  updateAvatar,
  createCard,
  objectIdParam,
};
