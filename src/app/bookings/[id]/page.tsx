// app/bookings/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Map from '@/components/Map';

export default function BookingDetailsPage() {
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState('');
  const [pickupLocation, setPickupLocation] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<any>(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${id}`);
        console.log(response.data);
        setBooking(response.data);
        setPickupLocation(response.data.pickupLocation.coordinates.reverse());
        if(response.data.driver && response.data.driver.currentLocation){
          console.log("Hello")
          setDriverLocation(response.data.driver.currentLocation.coordinates.reverse());
        }
      } catch (error: any) {
        console.log(error)
        setError(error.response?.data?.message || 'Failed to load booking');
      }
    };
    fetchBooking();
  }, [id]);


  

  if (error) return <div>{error}</div>;
  if (!booking) return <div>Loading...</div>;

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto mt-8 text-black">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">Booking Details</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="mb-2">
            <strong>Pickup Address:</strong> {booking.pickupLocation.address}
          </p>
          <p className="mb-2">
            <strong>Dropoff Address:</strong> {booking.dropoffLocation.address}
          </p>
          <p className="mb-2">
            <strong>Vehicle Type:</strong> {booking.vehicle?.type || 'Not assigned'}
          </p>
          <p className="mb-2">
            <strong>Status:</strong>{' '}
            <span className="capitalize">{booking.status}</span>
          </p>
          <p className="mb-2">
            <strong>Estimated Cost:</strong> ${booking.estimatedCost.toFixed(2)}
          </p>
          {booking.driver && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Driver Information</h2>
              <p className="mb-2">
                <strong>Name:</strong> {booking.driver.name}
              </p>
              <p className="mb-2">
                <strong>Phone:</strong> {booking.driver.phoneNumber}
              </p>
            </div>
          )}
        </div>
        <div className='py-4'></div>
      {driverLocation ?
        <Map pos1={pickupLocation} pos2={driverLocation}></Map> : <Map pos1={pickupLocation} pos2={pickupLocation}></Map>
       }
      </div>
    </ProtectedRoute>
  );
}
