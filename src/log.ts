/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDev } from '@/config.js';

const log = (message?: any, ...optionalParams: any[]) => {
  if (isDev) {
    // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-argument
    console.log(message, ...optionalParams);
  }
};

export default log;
