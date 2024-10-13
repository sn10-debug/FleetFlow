// app/api/users/profile/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';

async function handler(req: AuthenticatedRequest) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
  } else if (req.method === 'PUT') {
    const { name, phoneNumber, address } = await req.json();

    try {
      const user = await User.findByIdAndUpdate(
        req.userId,
        { name, phoneNumber, address },
        { new: true, runValidators: true }
      ).select('-password');
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}

export const GET = authenticate(handler);
export const PUT = authenticate(handler);
