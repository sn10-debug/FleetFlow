// app/api/drivers/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Driver from '@/models/Driver';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();

  try {
    // Find driver
    const driver = await Driver.findOne({ email });
    if (!driver) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Generate token
    const token = jwt.sign({ driverId: driver._id }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({ token, driverId: driver._id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}
