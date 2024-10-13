'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DriverLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (auth) {
      try {
        const response = await auth.loginDriver(email, password);
        if (response) {
          router.push('/driver/dashboard');
        }
      } catch (err: any) {
        setError(err.message || 'Login failed.');
      }
    }
  };

  return (
    <div className="flex text-black justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Driver Login
        </h1>
        {error && (
          <div className="mb-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/driver/register" className="text-indigo-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
