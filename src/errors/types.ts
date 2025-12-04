export const EHttpStatus = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  MultipleChoices: 300,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  InternalServerError: 500,
} as const;

export type THttpStatus = (typeof EHttpStatus)[keyof typeof EHttpStatus];

export type TErrorWithStatusCode = Error & {
  statusCode: THttpStatus;
};
