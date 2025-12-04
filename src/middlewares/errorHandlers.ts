import { errors } from 'celebrate';

import InternalServerError from '@/errors/InternalServerError.js';

import type { NextFunction, Request, Response } from 'express';
import type { TErrorWithStatusCode } from '@/errors/types.js';

const celebrateErrorHandler = errors();

const parseErrors = (
  error: TErrorWithStatusCode | Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
  // eslint-disable-next-line @typescript-eslint/max-params
) => {
  if ('statusCode' in error) {
    next(error);
  } else {
    next(new InternalServerError(error.message));
  }
};

const globalErrorHandler = (
  error: TErrorWithStatusCode,
  _req: Request,
  res: Response,
  _next: NextFunction,
  // eslint-disable-next-line @typescript-eslint/max-params
) => {
  const { statusCode, message } = error;

  res.status(statusCode).send({
    message,
  });
};

const errorHandlers = [celebrateErrorHandler, parseErrors, globalErrorHandler];

export default errorHandlers;
