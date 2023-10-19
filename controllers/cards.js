const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new NotFound(err.message));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { user } = req;

  Card.findById(cardId)
    .then((card) => {
      if (!card.owner.equals(user._id)) {
        throw new Forbidden('Карточка не ваша.');
      }
      Card.deleteOne({ _id: card._id })
        .orFail()
        .then(() => {
          res.status(204).send({ message: 'Карточка удалена.' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы некорректные данные для удаления карточки.'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound('Карточка с указанным _id не найдена.'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы некорректные данные для постановки/снятии лайка.'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound('Карточка с указанным _id не найдена.'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы некорректные данные для постановки/снятии лайка.'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound('Карточка с указанным _id не найдена.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
