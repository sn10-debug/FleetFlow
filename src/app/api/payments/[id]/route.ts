// app/api/payments/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Payment from '@/models/Payment';
import { authenticate, AuthenticatedRequest } from '@/middlewares/auth';

export const GET = authenticate(async (
  req: AuthenticatedRequest,
  context: { params: { id: string } }
) => {
  await dbConnect();

  const { id } = context.params;
  const userId = req.userId;

  try {
    const payment = await Payment.findOne({ _id: id, user: userId }).populate('booking');

    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json(payment, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Failed to retrieve payment', error: error.message },
      { status: 500 }
    );
  }
});
