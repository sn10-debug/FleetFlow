// src/models/Admin.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'fleet_manager' | 'support';
  createdAt: Date;
}

const AdminSchema: Schema = new Schema<IAdmin>({
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
    // Store hashed passwords
  },
  role: {
    type: String,
    enum: ['superadmin', 'fleet_manager', 'support'],
    default: 'support'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;

