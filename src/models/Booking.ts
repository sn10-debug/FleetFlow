// src/models/Booking.ts

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
}

export interface IBooking extends Document {
  user: Types.ObjectId;
  driver?: Types.ObjectId;
  vehicle?: Types.ObjectId;
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  estimatedCost: number;
  actualCost?: number;
  status: 'pending' | 'accepted' | 'en_route' | 'completed' | 'canceled';
  details?: string;
  createdAt: Date;
  updatedAt: Date;
  vehicleType: string;
  bookingDate: Date;
  cargoType: string;
  payment?: mongoose.Types.ObjectId;
  paymentStatus: 'pending' | 'paid';
  estimatedTime: number;
  estimatedDistance: number;
}

const BookingSchema: Schema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    

      paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
      },

 
    vehicleType: {
      required: true,
      type: String,
     enum: ['bike','car', 'van', 'truck'],
    },
    cargoType: {
      required: true,
      type: String,
      enum: ['fragile', 'non-fragile'],
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: 'Driver'
      // Initially null; assigned when a driver accepts the booking
    },
    bookingDate: {
      type: Date,
      required: true
    },
    estimatedDistance: {
      type: Number,
      required: true
    },
    estimatedTime: {
      type: Number,
      required: true
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle'
      // Initially null; assigned when a driver accepts the booking
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      },
      address: {
        type: String,
        trim: true,
        maxlength: 200
      }
    },
    dropoffLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      },
      address: {
        type: String,
        trim: true,
        maxlength: 200
      }
    },
    estimatedCost: {
      type: Number,
      required: true
    },
    actualCost: {
      type: Number
      // Set upon completion of the booking
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'en_route', 'completed', 'canceled'],
      default: 'pending'
    },
    details: {
      type: String,
      trim: true,
      maxlength: 500
      // Additional details about the goods to be transported
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    }
  },
  {
    timestamps: true // Automatically manage createdAt and updatedAt
  }
);


BookingSchema.index({ 'pickupLocation.coordinates': '2dsphere' });

const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);


export default Booking;

