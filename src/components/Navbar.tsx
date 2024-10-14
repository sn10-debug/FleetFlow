'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export default function Navbar() {
  const auth = useContext(AuthContext);

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="text-2xl font-bold">
            <span className="hover:text-indigo-200">FleetFlow</span>
          </Link>
        </div>
        <div className="space-x-4 flex items-center">
          {auth && auth.user && (
            <>
              <Link href="/bookings" className="hover:text-indigo-200">
                My Bookings
              </Link>
            </>
          )}

{auth && auth.user && (
            <>
              <Link href="/bookings/new" className="hover:text-indigo-200">
                New Booking
              </Link>
            </>
          )}

          {auth && auth.driver && (
            <>
              <Link href="/driver/dashboard" className="hover:text-indigo-200">
                Dashboard
              </Link>
            </>
          )}
          {!auth?.user && !auth?.driver && (
            <>
              <Link href="/login" className="hover:text-indigo-200">
                User Login
              </Link>
              <Link href="/register" className="hover:text-indigo-200">
                User Register
              </Link>
              <Link href="/driver/login" className="hover:text-indigo-200">
                Driver Login
              </Link>
              <Link href="/driver/register" className="hover:text-indigo-200">
                Driver Register
              </Link>
            </>
          )}
          {(auth?.user || auth?.driver) && (
            <button onClick={auth.logout} className="hover:text-indigo-200">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
