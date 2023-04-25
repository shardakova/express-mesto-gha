const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    trim: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', schema);
