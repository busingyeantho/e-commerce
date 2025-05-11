import React from 'react';
import SignupForm from '../components/auth/SignupForm'; // Import SignupForm

const SignupPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h1>
        <SignupForm /> {/* Use SignupForm */}
        <p className="text-center mt-4">
          Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-500 font-semibold">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
