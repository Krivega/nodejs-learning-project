import express from 'express';

import { PORT } from '@/config.js';
import connectDb from '@/db.js';
import log from '@/log.js';
import addUserToRequest from '@/middlewares/addUserToRequest.js';
import errorHandlers from '@/middlewares/errorHandlers.js';
import router from '@/routes/index.js';

const app = express();

app.use(express.json());

app.use(addUserToRequest);
app.use(router);

app.use(errorHandlers);

await connectDb().catch((error: unknown) => {
  log('Error connecting to database:', error);
  throw new Error('Failed to connect to database');
});

app.listen(PORT, () => {
  log('Server started on PORT:', `http://localhost:${PORT}`);
});
