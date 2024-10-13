// app/driver/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import ProtectedRoute from '@/components/ProtectedRoute';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export default function DriverDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(10); // Default radius in km
  const [status, setStatus] = useState<string>('available');

  useEffect(() => {
    // Initialize Socket.IO client
    socketInitializer();
  }, []);

  useEffect(() => {
    if (longitude !== null && latitude !== null) {
      fetchBookings();
    }
  }, [longitude, latitude, radius]);

  const socketInitializer = async () => {
    await fetch('/api/socket'); // Initialize Socket.IO server
    socket = io();

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('new-booking', (booking: any) => {
      // Check if the booking is within the driver's radius
      const isWithinRadius = checkIfWithinRadius(booking.pickupLocation.coordinates);
      if (isWithinRadius) {
        setBookings((prevBookings) => [...prevBookings, booking]);
      }
    });
  };

  const checkIfWithinRadius = (bookingCoordinates: [number, number]) => {
    const [bookingLongitude, bookingLatitude] = bookingCoordinates;
    const distance = calculateDistance(
      latitude!,
      longitude!,
      bookingLatitude,
      bookingLongitude
    );
    return distance <= radius;
  };

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/bookings/available', {
        params: {
          longitude,
          latitude,
          radius,
        },
      });
      setBookings(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load bookings');
    }
  };

  const handleAccept = async (bookingId: string) => {
    try {
      await axiosInstance.put(`/bookings/${bookingId}`, {
        status: 'accepted',
      });
      // Remove accepted booking from the list
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to accept booking');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    // Update driver status on the server
    try {
      await axiosInstance.put('/drivers/me', { status: newStatus });
    } catch (error: any) {
      setError('Failed to update status on server');
    }
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLongitude = position.coords.longitude;
          const currentLatitude = position.coords.latitude;

          setLongitude(currentLongitude);
          setLatitude(currentLatitude);

          // Update driver's location on the server
          try {
            await axiosInstance.put('/drivers/me', {
              longitude: currentLongitude,
              latitude: currentLatitude,
            });
          } catch (error: any) {
            setError('Failed to update location on server');
          }
        },
        (error) => {
          setError('Unable to retrieve your location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">
          Driver Dashboard
        </h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Set Your Location</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleGetLocation}
          >
            Use Current Location
          </button>
        </div>
        {latitude && longitude && (
          <div className="mb-6">
            <p>
              <strong>Current Location:</strong> Latitude: {latitude}, Longitude:{' '}
              {longitude}
            </p>
          </div>
        )}
        <div className="mb-6">
          <label className="block text-gray-700">Set Search Radius (km)</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2"
            min={1}
          />
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Set Your Status</h2>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <h2 className="text-xl font-semibold mb-4">Available Bookings</h2>
        {bookings.length === 0 ? (
          <p>No available bookings in your area.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking._id} className="border rounded-lg p-4 shadow-sm">
                <div>
                  <p className="font-semibold text-gray-700">
                    {booking.pickupLocation.address} →{' '}
                    {booking.dropoffLocation.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    Estimated Cost: ${booking.estimatedCost.toFixed(2)}
                  </p>
                </div>
                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={() => handleAccept(booking._id)}
                >
                  Accept Booking
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
