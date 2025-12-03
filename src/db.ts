import mongoose from 'mongoose';

import { MONGO_DB_PORT, MONGO_DB_NAME } from '@/config.js';

export const connect = async () => {
  return mongoose.connect(`mongodb://localhost:${MONGO_DB_PORT}/${MONGO_DB_NAME}`);
};
