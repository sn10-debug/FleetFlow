// app/api/payments/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';
// Import any payment gateway SDKs if integrating with real payments
// For example: import Stripe from 'stripe';

export const POST = authenticate(async (
  req: AuthenticatedRequest,
  context: { params: any }
) => {
  await dbConnect();

  const paymentData = await req.json();

  try {
    const { bookingId, paymentMethod } = paymentData;
    const userId = req.userId;

    // Fetch the booking to ensure it exists and belongs to the user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
    });

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found or not authorized' },
        { status: 404 }
      );
    }

    // Check if payment already exists for this booking
    const existingPayment = await Payment.findOne({ booking: bookingId });

    if (existingPayment) {
      return NextResponse.json(
        { message: 'Payment already made for this booking' },
        { status: 400 }
      );
    }

    // Simulate payment processing
    // In a real application, integrate with a payment gateway here
    // For example, using Stripe:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: booking.estimatedCost * 100, // Amount in cents
    //   currency: 'usd',
    //   payment_method: paymentMethod.id,
    //   confirm: true,
    // });

    // For simulation purposes, we'll assume the payment is successful
    const transactionId = `simulated_txn_${Date.now()}`;

    // Create a new payment record
    const payment = new Payment({
      user: userId,
      booking: bookingId,
      amount: booking.estimatedCost,
      currency: 'USD', // Adjust based on your application
      status: 'completed',
      paymentMethod: {
        type: paymentMethod.type,
        details: paymentMethod.details,
      },
      transactionId,
    });

    await payment.save();

    // Update the booking status to 'paid' or 'confirmed' as needed
    booking.status = 'paid'; // Or 'confirmed', depending on your workflow
    await booking.save();

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Payment processing failed', error: error.message },
      { status: 500 }
    );
  }
});
