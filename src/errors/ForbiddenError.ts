import { EHttpStatus } from './types.js';

import type { TErrorWithStatusCode, THttpStatus } from './types.js';

class ForbiddenError extends Error implements TErrorWithStatusCode {
  public statusCode: THttpStatus;

  public constructor(message: string) {
    super(message);
    this.statusCode = EHttpStatus.Forbidden;
  }
}

export default ForbiddenError;
