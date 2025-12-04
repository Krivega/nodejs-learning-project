import NotFoundError from '@/errors/NotFoundError.js';
import userModel from '../models/user.js';

import type { Request } from 'express';

const getMeUserId = async (req: Request<unknown, unknown, unknown, unknown>): Promise<string> => {
  const userId = (req as unknown as { user: { _id: string } }).user._id;

  return Promise.resolve().then(async () => {
    const isUserExists = await userModel.checkUserExists(userId);

    if (!isUserExists) {
      throw new NotFoundError('Пользователь не найден');
    }

    return userId;
  });
};

export default getMeUserId;
