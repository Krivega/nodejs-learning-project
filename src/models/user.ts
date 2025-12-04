import mongoose from 'mongoose';
import validator from 'validator';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface IUserModel extends mongoose.Model<IUser> {
  checkUserExists: (userId: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema({
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
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
});

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

export const userModelName = 'user';

const userModel = mongoose.model<IUser, IUserModel>(userModelName, userSchema);

export default userModel;
