// models/Payment.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: {
    type: string; // e.g., 'card', 'paypal'
    details: any; // Payment method details (masked card number, etc.)
  };
  transactionId: string; // ID from the payment provider
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: {
        type: String,

        enum: ['card', 'paypal', 'bank_transfer', 'other'],
      },
      details: {
        type: Schema.Types.Mixed,
      },
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt fields
  }
);

export default mongoose.models.Payment ||
  mongoose.model<IPayment>('Payment', PaymentSchema);
