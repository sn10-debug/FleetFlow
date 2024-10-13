// src/models/User.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100
  },
  password: {
    type: String,
    required: true
    // Store hashed passwords using bcrypt or a similar library
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  address: {
    type: String,
    trim: true,
    maxlength: 200
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the model and return your IUser interface
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;

