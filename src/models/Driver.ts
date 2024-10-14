// src/models/Driver.ts

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICurrentLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IDriver extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  vehicle: Types.ObjectId;
  currentLocation: ICurrentLocation;
  status: 'available' | 'busy' | 'offline';
  createdAt: Date;
}

const DriverSchema: Schema = new Schema<IDriver>({
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
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a geospatial index on currentLocation
DriverSchema.index({ currentLocation: '2dsphere' });



const Driver = mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema);

export default Driver;

