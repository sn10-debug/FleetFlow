// middlewares/auth.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
}

export function authenticate(handler: Function) {
  return async (req: AuthenticatedRequest, context: any) => {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Authorization token missing' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      req.userId = decoded.userId;
      // Pass both req and context to the handler
      return handler(req, context);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid authorization token' }, { status: 401 });
    }
  };
}
