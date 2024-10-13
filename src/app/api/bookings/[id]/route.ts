// app/api/bookings/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Booking from '@/models/Booking';
import Driver from '@/models/Driver';
import { authenticateDriver, AuthenticatedDriverRequest } from '@/middlewares/authDriver';

async function handler(
  req: AuthenticatedDriverRequest,
  context: { params: { id: string } }
) {
  await dbConnect();

  const { id } = context.params;

  if (req.method === 'PUT') {
    const { status } = await req.json();

    try {
      const booking = await Booking.findById(id);
      if (!booking) {
        return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
      }

      // Only allow driver to update booking if they are assigned to it or if accepting it
      if (booking.driver && booking.driver.toString() !== req.driverId) {
        return NextResponse.json(
          { message: 'Not authorized to update this booking' },
          { status: 403 }
        );
      }

      // Update booking status
      booking.status = status;

      // Assign driver and vehicle when accepted
      if (status === 'accepted' && !booking.driver) {
        booking.driver = req.driverId;

        const driver = await Driver.findById(req.driverId);
        if (driver) {
          booking.vehicle = driver.vehicle;
        }
      }

      await booking.save();

      return NextResponse.json(booking, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { message: 'Server Error', error: error.message },
        { status: 500 }
      );
    }
  } else if (req.method === 'GET') {
    // Get booking details
    try {
      const booking = await Booking.findById(id).populate('driver vehicle');
      if (!booking) {
        return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
      }
      return NextResponse.json(booking, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { message: 'Server Error', error: error.message },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: `Method ${req.method} Not Allowed` },
      { status: 405 }
    );
  }
}

export const PUT = authenticateDriver(handler);
export const GET = authenticateDriver(handler);
