// app/api/bookings/available/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Booking from '@/models/Booking';
import { authenticateDriver, AuthenticatedDriverRequest } from '@/middlewares/authDriver';

export const GET = authenticateDriver(async (
  req: AuthenticatedDriverRequest,
  context: { params: any }
) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const longitude = parseFloat(searchParams.get('longitude') || '');
  const latitude = parseFloat(searchParams.get('latitude') || '');
  const radius = parseFloat(searchParams.get('radius') || '');
  const vehicleType = searchParams.get('vehicleType');

  if (!longitude || !latitude || !radius) {
    return NextResponse.json(
      { message: 'Missing location or radius parameters' },
      { status: 400 }
    );
  }

  const radiusInMeters = radius * 1000; // Convert radius to meters

  console.log('Searching for available bookings within', radiusInMeters, 'meters');
  console.log('Longitude:', longitude);
  console.log('Latitude:', latitude);

  try {
    const availableBookings = await Booking.find({
      status: 'pending',
      driver: { $exists: false },
      'pickupLocation.coordinates': {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude],
            radiusInMeters / 6378137, // Earth's radius in meters
          ],
        },
      },
      vehicleType,
    }).exec();
   
    return NextResponse.json(availableBookings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server Error', error: error.message },
      { status: 500 }
    );
  }
});
