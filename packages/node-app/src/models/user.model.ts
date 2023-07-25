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
  units: Unit[];
  taId: number;
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
  units: {
    type: [String],
    enum: Object.values(Unit),
    required: true,
    default: [],
  },
  picture: { type: String, required: false },
  taId: { type: Number, required: true },
});

export const User = mongoose.model<User>('User', userSchema);
