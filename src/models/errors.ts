const MONGO_DUPLICATE_KEY_ERROR_CODE = 11_000;

type TMongoError = {
  code: number;
};

export const isMongoError = (error: unknown): error is TMongoError => {
  return typeof error === 'object' && error !== null && 'code' in error;
};

export const isMongoDuplicateKeyError = (error: unknown): error is TMongoError => {
  return isMongoError(error) && error.code === MONGO_DUPLICATE_KEY_ERROR_CODE;
};
