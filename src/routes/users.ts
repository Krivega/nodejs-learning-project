import express from 'express';

import {
  createUser,
  getUsers,
  getUserById,
  createUserSchema,
  getUserByIdSchema,
  updateUserByIdSchema,
  updateUserAvatarByIdSchema,
  updateUserById,
  updateUserAvatarById,
} from '@/controllers/users.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUserByIdSchema, getUserById);
router.post('/', createUserSchema, createUser);
router.put('/me', updateUserByIdSchema, updateUserById);
router.patch('/me/avatar', updateUserAvatarByIdSchema, updateUserAvatarById);

export default router;
