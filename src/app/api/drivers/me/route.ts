// app/api/drivers/me/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Driver from '@/models/Driver';
import { authenticateDriver, AuthenticatedDriverRequest } from '@/middlewares/authDriver';

export const PUT = authenticateDriver(async (
  req: AuthenticatedDriverRequest,
  context: { params: any }
) => {
  await dbConnect();

  const { longitude, latitude, status } = await req.json();

  try {
    console.log(req.driverId);
    const driver = await Driver.findById(req.driverId);
    if (!driver) {
      return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
    }

    if (longitude !== undefined && latitude !== undefined) {
      driver.currentLocation = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    if (status) {
      driver.status = status;
    }

    await driver.save();

    return NextResponse.json(driver, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server Error', error: error.message },
      { status: 500 }
    );
  }
});
