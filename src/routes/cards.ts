import express from 'express';

import {
  createCard,
  getCards,
  getCardById,
  createCardSchema,
  getCardByIdSchema,
  deleteCardById,
  deleteCardByIdSchema,
  likeCardByIdSchema,
  likeCardById,
  dislikeCardByIdSchema,
  dislikeCardById,
} from '@/controllers/cards.js';

const router = express.Router();

router.get('/', getCards);
router.get('/:cardId', getCardByIdSchema, getCardById);
router.post('/', createCardSchema, createCard);
router.delete('/:cardId', deleteCardByIdSchema, deleteCardById);
router.put('/:cardId/likes', likeCardByIdSchema, likeCardById);
router.delete('/:cardId/likes', dislikeCardByIdSchema, dislikeCardById);

export default router;
