import { errors } from 'celebrate';
import express from 'express';

import { PORT } from '@/config.js';
import { connect } from '@/db.js';
import log from '@/log.js';
import cardsRouter from '@/routes/cards.js';
import usersRouter from '@/routes/users.js';

import type { Request, Response, NextFunction } from 'express';
import type { TErrorWithStatusCode } from '@/errors/types.js';

const app = express();

await connect();

app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  // @ts-expect-error
  req.user = {
    _id: '693019c29518a1d8f4e3e8aa',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errors());
// eslint-disable-next-line @typescript-eslint/max-params
app.use((error: TErrorWithStatusCode, _req: Request, res: Response, _next: NextFunction) => {
  const { statusCode = 500, message } = error;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => {
  log('Server started on PORT:', `http://localhost:${PORT}`);
});
