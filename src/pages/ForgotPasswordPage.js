import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox (and spam folder).');
      toast.success('Password reset email sent!');
      setEmail(''); // Clear the input field
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        setError('No user found with this email address.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
      toast.error(error || 'Failed to send reset email.');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Reset Password</h1>
        {message && (
          <div className="p-3 mb-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </div>
        </form>
        <p className="text-center mt-4">
          Remember your password? <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
