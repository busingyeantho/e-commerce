import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to MyShop!</h1>
      <p className="text-lg text-gray-600 text-center mb-8">
        Your one-stop shop for the best products.
      </p>
      {/* You can add featured products or promotional content here */}
      <div className="text-center">
        <a 
          href="/products"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
};

export default HomePage;
