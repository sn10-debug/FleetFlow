// app/api/payments/confirm-payment/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/utils/dbConnect';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST = authenticate(async (req: AuthenticatedRequest) => {
  await dbConnect();

  const { bookingId, paymentIntentId } = await req.json();
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

    // Retrieve the Payment Intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['charges.data.payment_method_details.card'],
    });

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { message: 'Payment not successful' },
        { status: 400 }
      );
    }

    // Check if payment record already exists
    const existingPayment = await Payment.findOne({ transactionId: paymentIntent.id });
    if (existingPayment) {
      return NextResponse.json(
        { message: 'Payment already recorded' },
        { status: 400 }
      );
    }

    // Create a new payment record
    const payment = new Payment({
      user: userId,
      booking: bookingId,
      amount: paymentIntent.amount / 100, // Convert back to dollars
      currency: paymentIntent.currency.toUpperCase(),
      status: 'completed',
      paymentMethod: {
        type: 'card',
        
      },
      transactionId: paymentIntent.id,
    });

    await payment.save();

    // Update the booking status
    booking.status = 'paid';
    await booking.save();

    return NextResponse.json({ message: 'Payment confirmed' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Failed to confirm payment', error: error.message },
      { status: 500 }
    );
  }
});
