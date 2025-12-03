process.loadEnvFile();

const PORT = Number(process.env.PORT);

if (Number.isNaN(PORT) || PORT <= 0) {
  throw new Error('PORT is not a number');
}

const isDev = process.env.NODE_ENV !== 'production';

export { PORT, isDev };
