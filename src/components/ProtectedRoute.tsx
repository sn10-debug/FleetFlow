// components/ProtectedRoute.tsx

'use client';

import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!auth) return; // Wait for auth to be available
    if (!auth.loading && !auth.user) {
      
      router.push('/login');
    }
  }, [auth, router]);

  if (auth?.loading) {
    return null; // Or a loading spinner/component
  }

  return <>{auth?.user ? children : null}</>;
}
