import express from 'express';

import { createUser, createUserSchema, loginSchema, login } from '@/controllers/users.js';
import authLimiter from '@/middlewares/authLimiter.js';

const router = express.Router();

router.post('/signin', authLimiter, loginSchema, login);
router.post('/signup', authLimiter, createUserSchema, createUser);

export default router;
