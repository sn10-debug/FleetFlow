// middlewares/authDriver.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export interface AuthenticatedDriverRequest extends NextRequest {
  driverId?: string;
}

export function authenticateDriver(handler: Function) {
  return async (req: AuthenticatedDriverRequest, context: any) => {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Authorization token missing' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { driverId: string };
      req.driverId = decoded.driverId;
      // Pass both req and context to the handler
      return handler(req, context);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid authorization token' }, { status: 401 });
    }
  };
}
