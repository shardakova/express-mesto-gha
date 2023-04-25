const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      type: 'format',
      validator: (value) => {
        const validationSchema = Joi.string().email();
        const validationResult = validationSchema.validate(value);
        return !validationResult.error;
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    trim: true,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    trim: true,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      type: 'format',
      validator: (value) => {
        const validationSchema = Joi.string().uri({
          scheme: [
            /https?/,
          ],
        });
        const validationResult = validationSchema.validate(value);
        return !validationResult.error;
      },
    },
  },
});

schema.pre('save', function save(next) {
  const user = this;
  if (user.isModified('password') || this.isNew) {
    try {
      user.password = bcrypt.hashSync(user.password, 10);
    } catch (err) {
      return next(err);
    }
  }
  return next();
});

module.exports = mongoose.model('user', schema);
