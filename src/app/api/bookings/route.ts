// app/api/bookings/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Booking from '@/models/Booking';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';
import axios from 'axios'; // Import axios to send HTTP requests

export const POST = authenticate(async (
  req: AuthenticatedRequest,
  context: { params: any }
) => {
  await dbConnect();

  const bookingData = await req.json();

  try {
    const booking = new Booking({
      ...bookingData,
      user: req.userId,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await booking.save();

    // Notify the Socket.IO server
    await axios.post(`${process.env.SOCKET_SERVER}/emit`, {
      event: 'new-booking',
      data: booking,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server Error', error: error.message },
      { status: 500 }
    );
  }
});

export const GET=authenticate(async (
  req: AuthenticatedRequest,
  context: { params: any }
) => {
  await dbConnect();

  const bookings = await Booking.find({ user: req.userId });

  return NextResponse.json(bookings);
});


