// app/api/drivers/location/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Driver from '@/models/Driver';
import { authenticateDriver, AuthenticatedDriverRequest } from '@/middlewares/authDriver';

async function handler(req: AuthenticatedDriverRequest) {
  await dbConnect();

  if (req.method === 'PUT') {
    const { coordinates } = await req.json(); // [longitude, latitude]

    try {
      const driver = await Driver.findByIdAndUpdate(
        req.driverId,
        { currentLocation: { type: 'Point', coordinates } },
        { new: true }
      ).select('-password');
      if (!driver) {
        return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
      }
      return NextResponse.json(driver, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}

export const PUT = authenticateDriver(handler);
