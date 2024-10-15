// app/api/payments/create-payment-intent/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/utils/dbConnect';
import Booking from '@/models/Booking';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, );

export const POST = authenticate(async (req: AuthenticatedRequest) => {
  await dbConnect();

  const { bookingId } = await req.json();
  const userId = req.userId;

  try {
    // Fetch the booking
    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found or not authorized' },
        { status: 404 }
      );
    }

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.estimatedCost * 100), // Amount in cents
      currency: 'usd', // Adjust currency as needed
      metadata: { bookingId: booking._id.toString(), userId: (userId && userId.toString()) || '' },
    });

    return NextResponse.json(paymentIntent.client_secret, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Failed to create payment intent', error: error.message },
      { status: 500 }
    );
  }
});
