const mongoose = require('mongoose');
const HttpError = require('../utils/HttpError');
const ValidationError = require('../utils/ValidationError');
const User = require('../models/user');

const defaultFields = {
  name: 1,
  about: 1,
  avatar: 1,
};

async function getUsers(req, res, next) {
  try {
    const users = await User.find({}, defaultFields);
    return res.send(users);
  } catch (err) {
    return next(new HttpError('Internal Server Error', 500));
  }
}

async function createUser(req, res, next) {
  const { name, about, avatar } = req.body;
  try {
    const user = new User({
      name,
      about,
      avatar,
    });
    await user.validate();
    await user.save();
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError(err));
    }
    return next(new HttpError('Internal Server Error', 500));
  }
}

async function getUser(req, res, next) {
  try {
    let { id } = req.params;
    if (req.params.id === 'me') {
      id = req.user._id;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError('Bad Request', 400));
    }
    const user = await User.findById(id, defaultFields);
    if (!user) {
      return next(new HttpError('Not Found', 404));
    }
    return res.send(user);
  } catch (err) {
    return next(new HttpError('Internal Server Error', 500));
  }
}

async function updateUser(req, res, next) {
  try {
    const { name, about } = req.body;
    const id = req.user._id;
    const user = await User.findOneAndUpdate({
      _id: id,
    }, {
      name,
      about,
    }, {
      fields: defaultFields,
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new HttpError('Not Found', 404));
    }
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError(err));
    }
    return next(new HttpError('Internal Server Error', 500));
  }
}

async function updateAvatar(req, res, next) {
  try {
    const { avatar } = req.body;
    const id = req.user._id;
    const user = await User.findOneAndUpdate({
      _id: id,
    }, {
      avatar,
    }, {
      fields: defaultFields,
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new HttpError('Not Found', 404));
    }
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError(err));
    }
    return next(new HttpError('Internal Server Error', 500));
  }
}

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateAvatar,
};
