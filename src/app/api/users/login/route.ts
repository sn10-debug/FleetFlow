// app/api/users/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({ token, userId: user._id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}
