import { celebrate, Joi } from 'celebrate';
import validator from 'validator';

import NotFoundError from '@/errors/NotFoundError.js';
import getMeUserId from './getMeUserId.js';
import userModel, { checkUserExists } from '../models/user.js';

import type { Request, Response, NextFunction } from 'express';
import type { IUser } from '../models/user.js';

export const createUserSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom((value: string, helpers) => {
        if (!validator.isEmail(value)) {
          return helpers.error('any.invalid');
        }

        return value;
      })
      .messages({
        'any.invalid': 'Некорректный формат email',
      }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
    avatar: Joi.string().uri().required(),
  }),
});

const userNotExistsError = new NotFoundError('Пользователь не найден');

const getUserId = async (req: Request): Promise<string> => {
  const { userId } = req.params;

  return Promise.resolve().then(async () => {
    const isUserExists = await checkUserExists(userId);

    if (!isUserExists) {
      throw userNotExistsError;
    }

    return userId;
  });
};

const parseUserToResponse = (user: IUser) => {
  return {
    id: user._id,
    name: user.name,
    about: user.about,
    avatar: user.avatar,
  };
};
export const createUser = async (
  req: Request<
    unknown,
    unknown,
    { email: string; password: string; name: string; about: string; avatar: string }
  >,
  res: Response,
  next: NextFunction,
) => {
  const { email, password, name, about, avatar } = req.body;

  return userModel
    .create({ email, password, name, about, avatar })
    .then((user) => {
      return res.send({ data: parseUserToResponse(user) });
    })
    .catch(next);
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  return userModel
    .find({})
    .then((users) => {
      return res.send({ data: users.map(parseUserToResponse) });
    })
    .catch(next);
};

const resolveSendUserToResponse = (res: Response, next: NextFunction) => {
  return (user: IUser | null) => {
    if (!user) {
      next(userNotExistsError);

      return;
    }

    res.send({ data: parseUserToResponse(user) });
  };
};

export const getUserByIdSchema = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
});

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  return getUserId(req)
    .then((userId) => {
      return userModel.findById(userId);
    })
    .then(resolveSendUserToResponse(res, next))
    .catch(next);
};

export const updateUserByIdSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

export const updateUserById = async (
  req: Request<unknown, unknown, { name: string; about: string }>,
  res: Response,
  next: NextFunction,
) => {
  return getMeUserId(req)
    .then(async (userId) => {
      return userModel.findByIdAndUpdate(userId, req.body);
    })
    .then(resolveSendUserToResponse(res, next))
    .catch(next);
};

export const updateUserAvatarByIdSchema = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
});

export const updateUserAvatarById = async (
  req: Request<unknown, unknown, { avatar: string }>,
  res: Response,
  next: NextFunction,
) => {
  return getMeUserId(req)
    .then(async (userId) => {
      return userModel.findByIdAndUpdate(userId, req.body);
    })
    .then(resolveSendUserToResponse(res, next))
    .catch(next);
};
