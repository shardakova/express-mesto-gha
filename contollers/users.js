const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require('../utils/errors');

const defaultFields = {
  email: 1,
  name: 1,
  about: 1,
  avatar: 1,
};

async function getUsers(req, res, next) {
  try {
    const users = await User.find({}, defaultFields);
    return res.send(users);
  } catch (err) {
    return next(err);
  }
}

async function createUser(req, res, next) {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  try {
    const user = new User({
      email,
      password,
      name,
      about,
      avatar,
    });
    await user.validate();
    await user.save();
    return res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError());
    }
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return next(new ConflictError());
    }
    return next(err);
  }
}

async function getUser(req, res, next) {
  try {
    let { id } = req.params;
    if (req.route.path === '/users/me') {
      id = req.user._id;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new BadRequestError());
    }
    const user = await User.findById(id, defaultFields);
    if (!user) {
      return next(new NotFoundError());
    }
    return res.send(user);
  } catch (err) {
    return next(err);
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
      return next(new NotFoundError());
    }
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError());
    }
    return next(err);
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
      return next(new NotFoundError());
    }
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError());
    }
    return next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
    }, {
      password: 1,
    });
    if (!user) {
      return next(new UnauthorizedError());
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return next(new UnauthorizedError());
    }
    const token = jwt.sign({ _id: user._id }, config.JWT_TOKEN_SECRET, {
      expiresIn: '7d',
    });
    res.cookie('token', token, { httpOnly: true });
    return res.send({});
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateAvatar,
  login,
};
