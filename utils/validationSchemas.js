const Joi = require('joi');

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
    avatar: Joi.string().uri({
      scheme: [
        /https?/,
      ],
    }),
  }),
};

const updateUser = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(30),
    about: Joi.string().trim().min(2).max(30),
  }),
};

const updateAvatar = {
  body: Joi.object({
    avatar: Joi.string().uri({
      scheme: [
        /https?/,
      ],
    }),
  }),
};

const createCard = {
  body: Joi.object({
    name: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(30),
    link: Joi.string().required().uri({
      scheme: [
        /https?/,
      ],
    }),
  }),
};

const objectIdParam = {
  params: Joi.object({
    id: Joi.string().hex().length(24),
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
