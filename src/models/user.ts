import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema({
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

export const userModelName = 'user';

const userModel = mongoose.model<IUser>(userModelName, userSchema);

export const checkUserExists = async (userId: string) => {
  let isUserExists = false;

  try {
    isUserExists = (await userModel.exists({ _id: userId })) !== null;
  } catch {
    isUserExists = false;
  }

  return isUserExists;
};

export default userModel;
