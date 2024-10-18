'use client';

import { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';

export default function DriverRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    vehicleType: 'car',
    licensePlate: '',
    capacity: '',
    vehicleModel: '',
    color: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phoneNumber ||
      !formData.vehicleType ||
      !formData.licensePlate ||
      !formData.capacity ||
      !formData.vehicleModel
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axiosInstance.post('/drivers/register', formData);
      if (response.status === 201) {
        router.push('/driver/login');
      }
    } catch (error: any) {
      console.error(error.response?.data);
      setError(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="flex justify-center text-black items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Driver Registration
        </h1>
        {error && (
          <div className="mb-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
        
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
           
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Vehicle Information */}
          <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
            Vehicle Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle Type */}
            <div>
              <label className="block text-gray-700">Vehicle Type</label>
              <select
                name="vehicleType"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="motorbike">Motorbike</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* License Plate */}
            <div>
              <label className="block text-gray-700">License Plate</label>
              <input
                type="text"
                name="licensePlate"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.licensePlate}
                onChange={handleChange}
                required
              />
            </div>
            {/* Capacity */}
            <div>
              <label className="block text-gray-700">Capacity (kg)</label>
              <input
                type="number"
                name="capacity"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>
            {/* Vehicle Model */}
            <div>
              <label className="block text-gray-700">Model</label>
              <input
                type="text"
                name="vehicleModel"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.vehicleModel}
                onChange={handleChange}
                required
              />
            </div>
            {/* Color */}
            <div className="md:col-span-2">
              <label className="block text-gray-700">Color</label>
              <input
                type="text"
                name="color"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.color}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/driver/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
