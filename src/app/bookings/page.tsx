// app/bookings/page.tsx

'use client';

import useSWR from 'swr';
import axiosInstance from '@/utils/axiosInstance';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export default function BookingsPage() {
  const { data: bookings, error } = useSWR('/bookings', fetcher);

  if (error) return <div>Error loading bookings.</div>;
  if (!bookings) return <div>Loading...</div>;

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">My Bookings</h1>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking: any) => (
              <li key={booking._id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-700">
                      {booking.pickupLocation.address} → {booking.dropoffLocation.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="capitalize">{booking.status}</span>
                    </p>
                  </div>
                  <Link
                    href={`/bookings/${booking._id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
    </ProtectedRoute>
  );
}
