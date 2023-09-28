const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  ok, created, noContent, badRequest, notFound, internalServerError,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(ok).send(cards);
    })
    .catch(() => {
      res.status(internalServerError).send({ message: 'Ошибка по умолчанию.' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.status(created).send(newCard);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(internalServerError).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      res.status(noContent).send(deletedCard);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(internalServerError).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      res.status(ok).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(internalServerError).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      res.status(ok).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFound).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(internalServerError).send({ message: 'Ошибка по умолчанию.' });
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
