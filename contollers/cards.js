const mongoose = require('mongoose');
const HttpError = require('../utils/HttpError');
const ValidationError = require('../utils/ValidationError');
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
    return next(new HttpError('Internal Server Error', 500));
  }
}

async function createCard(req, res, next) {
  const { name, link } = req.body;
  try {
    const card = new Card({
      name,
      link,
      owner: req.user._id,
    });
    await card.validate();
    await card.save();
    return res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError(err));
    }
    return next(new HttpError('Internal Server Error', 500));
  }
}

async function deleteCard(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError('Bad Request', 400));
    }
    const card = await Card.findById(id);
    if (!card) {
      return next(new HttpError('Not Found', 404));
    }
    if (card.owner.toString() !== req.user._id) {
      return next(new HttpError('Forbidden', 403));
    }
    const result = await Card.deleteOne({
      _id: id,
      owner: req.user._id,
    });
    if (result.deletedCount === 0) {
      return next(new HttpError('Not Found', 404));
    }
    return res.send({ message: 'Карточка успешно удалена.' });
  } catch (err) {
    return next(new HttpError('Internal Server Error', 500));
  }
}

async function addLike(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError('Bad Request', 400));
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
      return next(new HttpError('Not Found', 404));
    }
    return res.send(card);
  } catch (err) {
    return next(new HttpError('Internal Server Error', 500));
  }
}

async function removeLike(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError('Bad Request', 400));
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
      return next(new HttpError('Not Found', 404));
    }
    return res.send(card);
  } catch (err) {
    return next(new HttpError('Internal Server Error', 500));
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
