// app/bookings/new/page.tsx

'use client';

import { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import PaymentForm from '@/components/PaymentForm';
import { set } from 'mongoose';



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
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localISOTime = new Date(today.getTime() - timezoneOffset).toISOString().split('T')[0];
    return localISOTime;
  });
  const [cargoType, setCargoType] = useState('fragile');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [payNow, setPayNow] = useState<boolean>(true);

  const router = useRouter();

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupAddress({ ...pickupAddress, [e.target.name]: e.target.value });
  };

  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDropoffAddress({ ...dropoffAddress, [e.target.name]: e.target.value });
  };

  const handleEstimate = async () => {

    setEstimatedCost(null);
    setEstimatedDistance(null);
    setEstimatedTime(null);
    try {
      // Combine address components into full address strings
      const pickupFullAddress = `${pickupAddress.city}, ${pickupAddress.state}, ${pickupAddress.pincode}`;
      const dropoffFullAddress = `${dropoffAddress.city}, ${dropoffAddress.state}, ${dropoffAddress.pincode}`;

      // Geocode addresses to get coordinates
      const pickupCoordinates = await geocodeAddress(pickupFullAddress);
      const dropoffCoordinates = await geocodeAddress(dropoffFullAddress);

    

      const response = await axiosInstance.get('/bookings/estimate', {
        params: {
          pickupLongitude: pickupCoordinates.lon,
          pickupLatitude: pickupCoordinates.lat,
          dropoffLongitude: dropoffCoordinates.lon,
          dropoffLatitude: dropoffCoordinates.lat,
          vehicleType,
          pickupCity: pickupAddress.city,
        },
      });
      setEstimatedCost(response.data.estimatedCost);
      setEstimatedDistance(response.data.distanceInKm);
      setEstimatedTime(response.data.timeEstimation);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to get estimate');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submitting');

    if(bookingId){
      alert("Booking is Already Created")
    }

    if(payNow){
      alert("Please Pay First")
    }
    try {
      // Combine address components into full address strings
      const pickupFullAddress = `${pickupAddress.city}, ${pickupAddress.state}, ${pickupAddress.pincode}`;
      const dropoffFullAddress = `${dropoffAddress.city}, ${dropoffAddress.state}, ${dropoffAddress.pincode}`;

  
      const today = new Date().toISOString().split('T')[0];
    if (bookingDate < today) {
      setError('Booking date cannot be in the past.');
      return;
    }

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
        vehicleType: vehicleType,
        bookingDate,
        cargoType,
        estimatedTime,
        estimatedDistance
      };

      const response=await axiosInstance.post('/bookings', bookingData);
      const newBooking = response.data;
      setBookingId(newBooking._id);
      if (payNow) {
        // Proceed to payment step
      } else {
        // Redirect or inform the user that booking is created
        router.push('/bookings');
      }
     
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
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cargo Type</label>
            <select
              name="cargoType"
              className="w-full px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
            >
              <option value="fragile">Fragile</option>
              <option value="non-fragile">Non-Fragile</option>
        
            </select>
          </div>

          {/* Booking Date */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-6">Booking Date</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Select a Date</label>
          <input
                type="date"
                name="bookingDate"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
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
            
            {/* Estimated Distance */}
          {estimatedDistance !== null && (
            <p className="mb-4 text-green-600 font-semibold">
              Estimated Distance: {estimatedDistance.toFixed(2)} km
            </p>
          )}

          {/* Estimated Time */}
          {estimatedTime !== null && (
            <p className="mb-4 text-green-600 font-semibold">
              Estimated Time: {estimatedTime.toFixed(2)} hours
            </p>
          )}
       {estimatedCost &&   <div>

{/* Payment Option */}
<h2 className="text-xl font-semibold text-gray-700 mb-4 mt-6">Payment Option</h2>
<div className="mb-4">
<label className="block text-gray-700 mb-2">Choose when to pay:</label>
<div className="flex items-center mb-2">
  <input
    type="radio"
    id="payNow"
    name="paymentOption"
    value="now"
    checked={payNow}
    onChange={() => setPayNow(true)}
    className="mr-2"
  />
  <label htmlFor="payNow">Pay Now</label>
</div>
<div className="flex items-center">
  <input
    type="radio"
    id="payLater"
    name="paymentOption"
    value="later"
    checked={!payNow}
    onChange={() => setPayNow(false)}
    className="mr-2"
  />
  <label htmlFor="payLater">Pay Later</label>
</div>
</div>


</div>} 
        {bookingId && estimatedCost !== null && payNow && (
          <PaymentForm bookingId={bookingId} amount={estimatedCost} />
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
