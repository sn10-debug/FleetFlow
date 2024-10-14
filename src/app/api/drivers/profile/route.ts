// app/api/drivers/profile/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Driver from '@/models/Driver';
import Vehicle from '@/models/Vehicle';
import { authenticateDriver, AuthenticatedDriverRequest } from '@/middlewares/authDriver';

async function handler(req: AuthenticatedDriverRequest) {

  // Get the driver id from the params


  await dbConnect();

  if (req.method === 'GET') {
    try {
      console.log("From Server : ",req.driverId);
      const driver = await Driver.findById(req.driverId).select('-password')
      // .populate('vehicle');
      if (!driver) {
        return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
      }
      return NextResponse.json(driver, { status: 200 });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
  } else if (req.method === 'PUT') {
    const { name, phoneNumber, currentLocation, status } = await req.json();

    try {
      const driver = await Driver.findByIdAndUpdate(
        req.driverId,
        { name, phoneNumber, currentLocation, status },
        { new: true, runValidators: true }
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

export const GET = authenticateDriver(handler);
export const PUT = authenticateDriver(handler);
