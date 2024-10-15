// components/PaymentForm.tsx

'use client';

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axiosInstance from '@/utils/axiosInstance';

interface PaymentFormProps {
  bookingId: string;
  amount: number;
}

export default function PaymentForm({ bookingId, amount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      setLoading(false);
      return;
    }

    try {
      // Create a Payment Intent on the server
      const { data: clientSecret } = await axiosInstance.post('/payments/create-payment-intent', {
        bookingId,
      });

      // Confirm the card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card element not found.');
        setLoading(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // Include additional billing details if required
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed.');
        setLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded, update the booking status
        await axiosInstance.post('/payments/confirm-payment', {
          bookingId,
          paymentIntentId: paymentIntent.id,
        });

        // Redirect or update UI as needed
        alert('Payment successful!');
        // Optionally redirect to a success page
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred during payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="mt-6">
      <label className="block text-gray-700 mb-2">Card Details</label>
      <div className="border px-3 py-2 rounded-lg mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': {
                  color: '#a0aec0',
                },
              },
              invalid: {
                color: '#fa755a',
              },
            },
          }}
        />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}
    