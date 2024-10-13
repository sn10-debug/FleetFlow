// app/register/page.tsx

'use client';

import { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
  });
  const router = useRouter();
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/users/register', formData);
      router.push('/login');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Create Your Account
        </h1>
        {error && (
          <div className="mb-4 text-red-500 text-center font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
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
          <div className="mb-4">
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
          {/* Password */}
          <div className="mb-4">
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
          {/* Phone Number */}
          <div className="mb-4">
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
          {/* Address */}
          <div className="mb-6">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
