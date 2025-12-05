import { verify } from '@/controllers/auth.js';
import { setUserIdToReq } from '@/controllers/userId.js';
import UnauthorizedError from '@/errors/UnauthorizedError.js';

import type { NextFunction, Request, Response } from 'express';

const auth = (req: Request, _res: Response, next: NextFunction): void => {
  const payload = verify(req);

  if (
    payload === undefined ||
    typeof payload === 'string' ||
    !('userId' in payload) ||
    typeof payload.userId !== 'string'
  ) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  setUserIdToReq(req, payload);

  next();
};

export default auth;
