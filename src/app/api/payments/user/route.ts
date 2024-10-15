
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Payment from '@/models/Payment';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';

export const GET = authenticate(async (req: AuthenticatedRequest) => {
  await dbConnect();

  const userId = req.userId;

  try {
    const payments = await Payment.find({ user: userId }).populate('booking');

    return NextResponse.json(payments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Failed to retrieve payments', error: error.message },
      { status: 500 }
    );
  }
});
