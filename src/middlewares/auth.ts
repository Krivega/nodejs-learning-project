import { verify } from '@/controllers/auth.js';
import { setAuthenticatedUserIdToReq } from '@/controllers/userId.js';
import { unauthorizedError } from '@/errors/index.js';

import type { NextFunction, Request, Response } from 'express';

const auth = (req: Request, _res: Response, next: NextFunction): void => {
  const payload = verify(req);

  if (
    payload === undefined ||
    typeof payload === 'string' ||
    !('userId' in payload) ||
    typeof payload.userId !== 'string'
  ) {
    throw unauthorizedError;
  }

  setAuthenticatedUserIdToReq(req, payload);

  next();
};

export default auth;
