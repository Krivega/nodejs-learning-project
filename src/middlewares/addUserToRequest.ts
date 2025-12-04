import type { NextFunction, Request, Response } from 'express';

const addUserToRequest = (req: Request, _res: Response, next: NextFunction) => {
  // временный код для тестирования
  // @ts-expect-error
  req.user = {
    _id: '693019c29518a1d8f4e3e8aa',
  };

  next();
};

export default addUserToRequest;
