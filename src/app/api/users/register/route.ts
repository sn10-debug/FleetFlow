// app/api/users/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, email, password, phoneNumber, address } = await req.json();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address
    });

    await user.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}
