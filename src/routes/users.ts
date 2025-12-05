import express from 'express';

import {
  getMe,
  getUserById,
  getUserByIdSchema,
  getUsers,
  updateUserAvatarById,
  updateUserAvatarByIdSchema,
  updateUserById,
  updateUserByIdSchema,
} from '@/controllers/users.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/me', getMe);
router.put('/me', updateUserByIdSchema, updateUserById);
router.patch('/me/avatar', updateUserAvatarByIdSchema, updateUserAvatarById);
router.get('/:userId', getUserByIdSchema, getUserById);

export default router;
