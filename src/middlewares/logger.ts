import expressWinston from 'express-winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const createDailyRotateTransport = (
  filename: string,
  maxSize = '20m',
  maxFiles = '14d',
): DailyRotateFile => {
  return new DailyRotateFile({
    maxSize,
    maxFiles,
    filename: `logs/${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    format: winston.format.json(),
  });
};

export const requestLogger = expressWinston.logger({
  transports: [createDailyRotateTransport('request', '20m', '14d')],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [createDailyRotateTransport('error', '20m', '14d')],
  format: winston.format.json(),
});
