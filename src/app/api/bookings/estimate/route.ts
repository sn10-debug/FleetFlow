// app/api/bookings/estimate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDistance } from 'geolib';
import dbConnect from '@/utils/dbConnect';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';

async function handler(req: AuthenticatedRequest) {
  await dbConnect();

  if (req.method === 'GET') {
    const { searchParams } = new URL(req.url);
    const pickupLongitude = parseFloat(searchParams.get('pickupLongitude') || '0');
    const pickupLatitude = parseFloat(searchParams.get('pickupLatitude') || '0');
    const dropoffLongitude = parseFloat(searchParams.get('dropoffLongitude') || '0');
    const dropoffLatitude = parseFloat(searchParams.get('dropoffLatitude') || '0');
    const vehicleType = searchParams.get('vehicleType') || 'car';

    try {
      // Calculate distance
      const distanceInMeters = getDistance(
        {
          longitude: pickupLongitude,
          latitude: pickupLatitude
        },
        {
          longitude: dropoffLongitude,
          latitude: dropoffLatitude
        }
      );

      // Basic pricing logic
      const baseFare = 5; // Base fare in dollars
      const costPerKm = 1; // Cost per kilometer

      // Adjust cost per km based on vehicle type
      let vehicleMultiplier = 1;
      switch (vehicleType) {
        case 'motorbike':
          vehicleMultiplier = 0.8;
          break;
        case 'car':
          vehicleMultiplier = 1;
          break;
        case 'van':
          vehicleMultiplier = 1.2;
          break;
        case 'truck':
          vehicleMultiplier = 1.5;
          break;
        default:
          vehicleMultiplier = 1;
          break;
      }

      // Calculate estimated cost
      const distanceInKm = distanceInMeters / 1000;
      const estimatedCost = baseFare + distanceInKm * costPerKm * vehicleMultiplier;

      return NextResponse.json({ estimatedCost }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}

export const GET = authenticate(handler);
