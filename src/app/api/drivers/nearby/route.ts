// app/api/drivers/nearby/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Driver from '@/models/Driver';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';

async function handler(req: AuthenticatedRequest) {
  await dbConnect();

  if (req.method === 'GET') {
    const { searchParams } = new URL(req.url);
    const longitude = parseFloat(searchParams.get('longitude') || '0');
    const latitude = parseFloat(searchParams.get('latitude') || '0');
    const radius = parseFloat(searchParams.get('radius') || '5000'); // Default to 5km

    try {
      const drivers = await Driver.find({
        currentLocation: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 6378100] // Earth radius in meters
          }
        },
        status: 'available'
      }).select('-password');

      return NextResponse.json(drivers, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}

export const GET = authenticate(handler);
