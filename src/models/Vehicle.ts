// src/models/Vehicle.ts

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVehicle extends Document {
  driver: Types.ObjectId;
  type: 'motorbike' | 'car' | 'van' | 'truck' | 'other';
  licensePlate: string;
  capacity: number;
  vehicleModel: string; 
  color?: string;
  createdAt: Date;
}

const VehicleSchema: Schema = new Schema<IVehicle>({
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['car', 'van', 'truck']
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20
  },
  capacity: {
    type: Number, // in kilograms
    required: true
  },
  vehicleModel: { // renamed from model to vehicleModel
    type: String,
    trim: true,
    maxlength: 50
  },
  color: {
    type: String,
    trim: true,
    maxlength: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Vehicle = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
export default Vehicle;
