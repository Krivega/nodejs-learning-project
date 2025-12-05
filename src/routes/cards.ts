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
router.post('/', createCardSchema, createCard);
router.put('/:cardId/likes', likeCardByIdSchema, likeCardById);
router.delete('/:cardId/likes', dislikeCardByIdSchema, dislikeCardById);
router.get('/:cardId', getCardByIdSchema, getCardById);
router.delete('/:cardId', deleteCardByIdSchema, deleteCardById);

export default router;
