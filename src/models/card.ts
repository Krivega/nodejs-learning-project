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

interface ICardModel extends mongoose.Model<ICard> {
  checkCardExists: (cardId: string) => Promise<boolean>;
}

const cardSchema = new mongoose.Schema<ICard, ICardModel>({
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

cardSchema.statics.checkCardExists = async function checkCardExists(
  cardId: string,
): Promise<boolean> {
  let isCardExists = false;

  try {
    isCardExists = (await this.exists({ _id: cardId })) !== null;
  } catch {
    isCardExists = false;
  }

  return isCardExists;
};

const cardModel = mongoose.model<ICard, ICardModel>('card', cardSchema);

export default cardModel;
