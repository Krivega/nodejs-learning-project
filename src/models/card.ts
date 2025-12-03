import mongoose from 'mongoose';

import { userModelName } from './user.js';

import type { IUser } from './user.js';

export interface ICard {
  _id: string;
  name: string;
  link: string;
  createdAt: Date;
  owner: IUser;
  likes: IUser[];
}

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModelName,
    required: true,
  },
  likes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModelName,
      },
    ],
    default: [],
  },
});

const cardModel = mongoose.model<ICard>('card', cardSchema);

export const checkCardExists = async (cardId: string) => {
  let isCardExists = false;

  try {
    isCardExists = (await cardModel.exists({ _id: cardId })) !== null;
  } catch {
    isCardExists = false;
  }

  return isCardExists;
};

export default cardModel;
