// app/bookings/new/page.tsx

'use client';

import { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewBookingPage() {
  const [pickupAddress, setPickupAddress] = useState({
    street: '',
    city: '',
    pincode: '',
    state: ''
  });
  const [dropoffAddress, setDropoffAddress] = useState({
    street: '',
    city: '',
    pincode: '',
    state: ''
  });
  const [vehicleType, setVehicleType] = useState('car');
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupAddress({ ...pickupAddress, [e.target.name]: e.target.value });
  };

  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDropoffAddress({ ...dropoffAddress, [e.target.name]: e.target.value });
  };

  const handleEstimate = async () => {
    try {
      // Combine address components into full address strings
      const pickupFullAddress = `${pickupAddress.city}, ${pickupAddress.state}, ${pickupAddress.pincode}`;
      const dropoffFullAddress = `${dropoffAddress.city}, ${dropoffAddress.state}, ${dropoffAddress.pincode}`;

      // Geocode addresses to get coordinates
      const pickupCoordinates = await geocodeAddress(pickupFullAddress);
      const dropoffCoordinates = await geocodeAddress(dropoffFullAddress);

      console.log(pickupCoordinates, dropoffCoordinates);

      const response = await axiosInstance.get('/bookings/estimate', {
        params: {
          pickupLongitude: pickupCoordinates.lon,
          pickupLatitude: pickupCoordinates.lat,
          dropoffLongitude: dropoffCoordinates.lon,
          dropoffLatitude: dropoffCoordinates.lat,
          vehicleType,
        },
      });
      setEstimatedCost(response.data.estimatedCost);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to get estimate');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submitting');
    try {
      // Combine address components into full address strings
      const pickupFullAddress = `${pickupAddress.city}, ${pickupAddress.state}, ${pickupAddress.pincode}`;
      const dropoffFullAddress = `${dropoffAddress.city}, ${dropoffAddress.state}, ${dropoffAddress.pincode}`;

      console.log(pickupFullAddress, dropoffFullAddress);

      // Geocode addresses to get coordinates
      const pickupCoordinates = await geocodeAddress(pickupFullAddress);
      const dropoffCoordinates = await geocodeAddress(dropoffFullAddress);

      const bookingData = {
        pickupLocation: {
          type: 'Point',
          coordinates: [pickupCoordinates.lon, pickupCoordinates.lat],
          address: pickupFullAddress,
        },
        dropoffLocation: {
          type: 'Point',
          coordinates: [dropoffCoordinates.lon, dropoffCoordinates.lat],
          address: dropoffFullAddress,
        },
        estimatedCost,
        details,
      };

      await axiosInstance.post('/bookings', bookingData);
      router.push('/bookings');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const geocodeAddress = async (address: string) => {

  
  console.log(address)

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

const response=await fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data && data.length > 0) {
      const location = data[0];
     return location
    } else {
      console.log("Address not found");
    }
  })
  .catch(error => console.error("Error:", error));

    return response; 
  };

  return (
 
      <div className="max-w-lg mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Create a Booking
        </h1>
        {error && (
          <div className="mb-4 text-red-500 text-center font-semibold">{error}</div>
        )}
        <form className='text-black' onSubmit={handleSubmit}>
          {/* Pickup Address */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Pickup Address</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Street Address</label>
            <input
              type="text"
              name="street"
              className="w-full px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={pickupAddress.street}
              onChange={handlePickupChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                name="city"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={pickupAddress.city}
                onChange={handlePickupChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">State</label>
              <input
                type="text"
                name="state"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={pickupAddress.state}
                onChange={handlePickupChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Pincode</label>
            <input
              type="text"
              name="pincode"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={pickupAddress.pincode}
              onChange={handlePickupChange}
              required
            />
          </div>

          {/* Dropoff Address */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-6">Dropoff Address</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Street Address</label>
            <input
              type="text"
              name="street"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={dropoffAddress.street}
              onChange={handleDropoffChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                name="city"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={dropoffAddress.city}
                onChange={handleDropoffChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">State</label>
              <input
                type="text"
                name="state"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={dropoffAddress.state}
                onChange={handleDropoffChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Pincode</label>
            <input
              type="text"
              name="pincode"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={dropoffAddress.pincode}
              onChange={handleDropoffChange}
              required
            />
          </div>

          {/* Vehicle Type */}
          <div className="mb-4">
            <label className="block text-gray-700">Vehicle Type</label>
            <select
              name="vehicleType"
              className="w-full px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="motorbike">Motorbike</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>
          </div>

          {/* Details */}
          <div className="mb-4">
            <label className="block text-gray-700">Details</label>
            <textarea
              name="details"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            ></textarea>
          </div>

          {/* Estimated Cost */}
          {estimatedCost !== null && (
            <p className="mb-4 text-green-600 font-semibold">
              Estimated Cost: ${estimatedCost.toFixed(2)}
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleEstimate}
            >
              Get Estimate
            </button>
            <button
              type="submit"
              onClick={(e) => {
                console.log("Hello World")
                handleSubmit(e)}}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              disabled={estimatedCost === null}
            >
              Create Booking
            </button>
          </div>
        </form>
      </div>

  );
}
