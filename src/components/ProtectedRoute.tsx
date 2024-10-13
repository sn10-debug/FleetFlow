// components/ProtectedRoute.tsx

'use client';

import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.push('/login');
    }
  }, [auth, router]);

  return <>{auth?.user ? children : null}</>;
}
