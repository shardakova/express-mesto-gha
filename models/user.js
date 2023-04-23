const mongoose = require('mongoose');

const scheme = {
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    trim: true,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    trim: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      type: 'format',
      validator: (value) => {
        let parsedUrl;
        try {
          parsedUrl = new URL(value);
        } catch (error) {
          return false;
        }
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
      },
    },
  },
};

module.exports = mongoose.model('user', new mongoose.Schema(scheme));
