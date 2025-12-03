import express from 'express';

import { PORT } from '@/config.js';
import log from '@/log.js';
import '@/temp';

const app = express();

app.listen(PORT, () => {
  log('Server started on PORT:', `http://localhost:${PORT}`);
});

app.get('/', (_req, res) => {
  res.send('<h1>Привет, мир!</h1>');
});
