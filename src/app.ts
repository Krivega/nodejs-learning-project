import cookieParser from 'cookie-parser';
import express from 'express';

import { PORT } from '@/config.js';
import connectDb from '@/db.js';
import log from '@/log.js';
import auth from '@/middlewares/auth.js';
import errorHandlers from '@/middlewares/errorHandlers.js';
import authRouter from '@/routes/auth.js';
import authorizedRouter from '@/routes/authorizedRouter.js';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(authRouter);

app.use(auth, authorizedRouter);

app.use(errorHandlers);

await connectDb().catch((error: unknown) => {
  log('Error connecting to database:', error);
  throw new Error('Failed to connect to database');
});

app.listen(PORT, () => {
  log('Server started on PORT:', `http://localhost:${PORT}`);
});
