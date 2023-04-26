const mongoose = require('mongoose');
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../utils/errors');
const Card = require('../models/card');

const defaultFields = {
  name: 1,
  link: 1,
  owner: 1,
  likes: 1,
  createdAt: 1,
};

async function getCards(req, res, next) {
  try {
    const cards = await Card.find({}, defaultFields);
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
}

async function createCard(req, res, next) {
  const { name, link } = req.body;
  try {
    const card = await Card.create({
      name,
      link,
      owner: req.user._id,
    });
    res.status(201);
    return res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError());
    }
    return next(err);
  }
}

async function deleteCard(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new BadRequestError());
    }
    const card = await Card.findById(id);
    if (!card) {
      return next(new NotFoundError());
    }
    if (card.owner.toString() !== req.user._id) {
      return next(new ForbiddenError());
    }
    await card.deleteOne();
    return res.send({ message: 'Карточка успешно удалена.' });
  } catch (err) {
    return next(err);
  }
}

async function addLike(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new BadRequestError());
    }
    const card = await Card.findOneAndUpdate({
      _id: id,
    }, {
      $addToSet: {
        likes: req.user._id,
      },
    }, {
      fields: defaultFields,
      new: true,
    });
    if (!card) {
      return next(new NotFoundError());
    }
    return res.send(card);
  } catch (err) {
    return next(err);
  }
}

async function removeLike(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new BadRequestError());
    }
    const card = await Card.findOneAndUpdate({
      _id: id,
    }, {
      $pull: {
        likes: req.user._id,
      },
    }, {
      fields: defaultFields,
      new: true,
    });
    if (!card) {
      return next(new NotFoundError());
    }
    return res.send(card);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
