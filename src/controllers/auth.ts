import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '@/config.js';

import type { Request, Response } from 'express';

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_EXPIRATION_TIME = SEVEN_DAYS_IN_MS;

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: `${TOKEN_EXPIRATION_TIME}ms` });
};

export const setTokenToCookie = (token: string, res: Response) => {
  res.cookie('jwt', token, { httpOnly: true, sameSite: true, maxAge: TOKEN_EXPIRATION_TIME });
};

export const login = (userId: string, res: Response) => {
  const token = generateToken(userId);

  setTokenToCookie(token, res);
};

export const logout = (res: Response) => {
  res.clearCookie('jwt');
};

export const verify = (req: Request) => {
  return req.cookies.jwt !== undefined && typeof req.cookies.jwt === 'string'
    ? jwt.verify(req.cookies.jwt, JWT_SECRET)
    : undefined;
};
