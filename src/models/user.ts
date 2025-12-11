import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

import { wrongCredentialsError } from '@/errors/index.js';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

export interface IUserCreate {
  email: string;
  password: string;
  name?: string;
  about?: string;
  avatar?: string;
}

export interface IUserPublic {
  _id: string;
  email: string;
  name: string;
  about: string;
  avatar: string;
}

interface IUserModel extends mongoose.Model<IUser> {
  checkUserExists: (userId: string) => Promise<boolean>;
  createUser: (user: IUserCreate) => Promise<IUserPublic>;
  findUserByCredentials: (params: { email: string; password: string }) => Promise<IUserPublic>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => {
        return validator.isEmail(value);
      },
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value: string) => {
        return validator.isURL(value);
      },
      message: 'Некорректный формат URL',
    },
  },
});

const parseUserToResponse = (user: IUser): IUserPublic => {
  return {
    _id: String(user._id),
    email: user.email,
    name: user.name,
    about: user.about,
    avatar: user.avatar,
  };
};

userSchema.statics.checkUserExists = async function checkUserExists(
  userId: string,
): Promise<boolean> {
  let isUserExists = false;

  try {
    isUserExists = (await this.exists({ _id: userId })) !== null;
  } catch {
    isUserExists = false;
  }

  return isUserExists;
};

userSchema.statics.createUser = async function createUser(
  params: IUserCreate,
): Promise<IUserPublic> {
  const hashedPassword = await bcrypt.hash(params.password, 10);

  const userCreated = await this.create({ ...params, password: hashedPassword });

  return parseUserToResponse(userCreated);
};

userSchema.statics.findUserByCredentials = async function findUserByCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<IUserPublic> {
  const user: IUser | null = await this.findOne({ email }).select('+password');

  if (!user) {
    throw wrongCredentialsError;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw wrongCredentialsError;
  }

  return parseUserToResponse(user);
};

export const userModelName = 'user';

const userModel = mongoose.model<IUser, IUserModel>(userModelName, userSchema);

export default userModel;
