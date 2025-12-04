import { Router } from 'express';

import cardsRouter from './cards.js';
import usersRouter from './users.js';

const authorizedRouter = Router();

authorizedRouter.use('/users', usersRouter);
authorizedRouter.use('/cards', cardsRouter);

export default authorizedRouter;
