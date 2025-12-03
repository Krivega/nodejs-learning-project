process.loadEnvFile();

const PORT = Number(process.env.PORT);

if (Number.isNaN(PORT) || PORT <= 0) {
  throw new Error('PORT is not a number');
}

const MONGO_DB_PORT = Number(process.env.MONGO_DB_PORT);

if (Number.isNaN(MONGO_DB_PORT) || MONGO_DB_PORT <= 0) {
  throw new Error('MONGO_DB_PORT is not a number');
}

const { MONGO_DB_NAME } = process.env;

if (MONGO_DB_NAME === undefined) {
  throw new Error('MONGO_DB_NAME is not defined');
}

const isDev = process.env.NODE_ENV !== 'production';

export { PORT, MONGO_DB_PORT, MONGO_DB_NAME, isDev };
