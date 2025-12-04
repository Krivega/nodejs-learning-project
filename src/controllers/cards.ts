import { celebrate, Joi } from 'celebrate';

import NotFoundError from '@/errors/NotFoundError.js';
import getMeUserId from './getMeUserId.js';
import cardModel from '../models/card.js';

import type { NextFunction, Request, Response } from 'express';
import type { ICard } from '../models/card.js';
import type { IUser } from '../models/user.js';

export const createCardSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
});

const cardNotExistsError = new NotFoundError('Карточка не найдена');

const getCardId = async (req: Request): Promise<string> => {
  const { cardId } = req.params;

  return Promise.resolve().then(async () => {
    const isCardExists = await cardModel.checkCardExists(cardId);

    if (!isCardExists) {
      throw cardNotExistsError;
    }

    return cardId;
  });
};

const parseCardToResponse = (card: ICard) => {
  return {
    id: card._id,
    name: card.name,
    link: card.link,
    owner: card.owner,
    likes: card.likes,
  };
};

const resolveSendCardToResponse = (res: Response, next: NextFunction) => {
  return (card: ICard | null) => {
    if (!card) {
      next(cardNotExistsError);

      return;
    }

    res.send({ data: parseCardToResponse(card) });
  };
};

export const createCard = async (
  req: Request<unknown, unknown, { name: string; link: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  return getMeUserId(req)
    .then(async (userId) => {
      return cardModel.create({ name, link, owner: userId as unknown as IUser });
    })
    .then(resolveSendCardToResponse(res, next))
    .catch(next);
};

export const getCards = async (_req: Request, res: Response, next: NextFunction) => {
  return cardModel
    .find({})
    .then((cards) => {
      return res.send({ data: cards.map(parseCardToResponse) });
    })
    .catch(next);
};

export const getCardByIdSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

export const getCardById = async (req: Request, res: Response, next: NextFunction) => {
  return getCardId(req)
    .then((cardId) => {
      return cardModel.findById(cardId);
    })
    .then(resolveSendCardToResponse(res, next))
    .catch(next);
};

export const deleteCardByIdSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
  return getMeUserId(req)
    .then((userId) => {
      return cardModel.findByIdAndDelete(req.params.cardId, { owner: userId });
    })
    .then(resolveSendCardToResponse(res, next))
    .catch(next);
};

export const likeCardByIdSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

export const likeCardById = async (req: Request, res: Response, next: NextFunction) => {
  return Promise.all([getMeUserId(req), getCardId(req)])
    .then(([userId, cardId]) => {
      return cardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true });
    })
    .then(resolveSendCardToResponse(res, next))
    .catch(next);
};

export const dislikeCardByIdSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

export const dislikeCardById = async (req: Request, res: Response, next: NextFunction) => {
  return Promise.all([getMeUserId(req), getCardId(req)])
    .then(([userId, cardId]) => {
      return cardModel.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true });
    })
    .then(resolveSendCardToResponse(res, next))
    .catch(next);
};
