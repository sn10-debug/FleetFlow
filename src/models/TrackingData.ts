// src/models/TrackingData.ts

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITrackingData extends Document {
  driver: Types.ObjectId;
  booking: Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  timestamp: Date;
}

const TrackingDataSchema: Schema = new Schema<ITrackingData>({
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create a geospatial index on location
TrackingDataSchema.index({ location: '2dsphere' });

const TrackingData = mongoose.models.TrackingData || mongoose.model<ITrackingData>('TrackingData', TrackingDataSchema);

export default TrackingData
