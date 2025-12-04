import { verify } from '@/controllers/auth.js';
import UnauthorizedError from '@/errors/UnauthorizedError.js';

import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

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

  req.user = payload as JwtPayload & { userId: string };

  next();
};

export default auth;
