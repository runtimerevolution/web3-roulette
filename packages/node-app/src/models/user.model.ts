import mongoose, { Schema } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Unit {
  NODE = 'node',
  RAILS = 'rails',
  PYTHON = 'python',
}

export interface User extends mongoose.Document {
  email: string;
  name: string;
  picture: string;
  role: UserRole;
  unit: Unit;
}

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.USER,
  },
  unit: { type: String, enum: Object.values(Unit), required: false },
  picture: { type: String, required: false },
});

export const User = mongoose.model<User>('User', userSchema);
