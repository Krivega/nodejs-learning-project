process.loadEnvFile();

const getEnvDefined = (env: string): string => {
  const value = process.env[env];

  if (value === undefined) {
    throw new Error(`${env} is not defined`);
  }

  return value;
};

const PORT = Number(getEnvDefined('PORT'));

if (Number.isNaN(PORT) || PORT <= 0) {
  throw new Error('PORT is not a number');
}

const MONGO_DB_PORT = Number(getEnvDefined('MONGO_DB_PORT'));

if (Number.isNaN(MONGO_DB_PORT) || MONGO_DB_PORT <= 0) {
  throw new Error('MONGO_DB_PORT is not a number');
}

const MONGO_DB_NAME = getEnvDefined('MONGO_DB_NAME');
const JWT_SECRET = getEnvDefined('JWT_SECRET');

const isDev = process.env.NODE_ENV !== 'production';

export { PORT, MONGO_DB_PORT, MONGO_DB_NAME, JWT_SECRET, isDev };
