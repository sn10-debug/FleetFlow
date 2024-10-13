// app/api/drivers/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Driver from '@/models/Driver';
import Vehicle from '@/models/Vehicle';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  await dbConnect();
  const {
    name,
    email,
    password,
    phoneNumber,
    vehicleType,
    licensePlate,
    capacity,
    model,
    color
  } = await req.json();

  try {
    // Check if driver already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return NextResponse.json({ message: 'Driver already exists' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create driver
    const driver = new Driver({
      name,
      email,
      password: hashedPassword,
      phoneNumber
      // currentLocation and status will be set to defaults
    });

    await driver.save();

    // Create vehicle
    const vehicle = new Vehicle({
      driver: driver._id,
      type: vehicleType,
      licensePlate,
      capacity,
      model,
      color
    });

    await vehicle.save();

    // Update driver's vehicle reference
    driver.vehicle = vehicle._id as typeof driver.vehicle;
    await driver.save();

    return NextResponse.json({ message: 'Driver registered successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}
