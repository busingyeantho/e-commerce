import React from 'react';
import LoginForm from '../components/auth/LoginForm'; // Import LoginForm

const LoginPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>
        <LoginForm /> {/* Use LoginForm */}
        <p className="text-center mt-4">
          Don't have an account? <a href="/signup" className="text-indigo-600 hover:text-indigo-500 font-semibold">Sign up</a>
        </p>
        <p className="text-center mt-2">
          <a href="/forgot-password" className="text-sm text-gray-600 hover:text-indigo-500">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
