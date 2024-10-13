// app/api/bookings/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Booking from '@/models/Booking';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';
import { getIO } from '@/utils/socket';

async function handler(req: AuthenticatedRequest) {
  await dbConnect();

  if (req.method === 'POST') {
    const { pickupLocation, dropoffLocation, estimatedCost, details } = await req.json();

    try {
      const booking = new Booking({
        user: req.userId,
        pickupLocation,
        dropoffLocation,
        estimatedCost,
        details
      });

      await booking.save();

      const io = getIO();
      io.emit('new-booking', booking);

      return NextResponse.json(booking, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
  } else if (req.method === 'GET') {
    // Get bookings for the user
    try {
      const bookings = await Booking.find({ user: req.userId }).populate('driver vehicle');
      return NextResponse.json(bookings, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}

export const POST = authenticate(handler);
export const GET = authenticate(handler);
