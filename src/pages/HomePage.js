import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Hello Section */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-xl mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Hello & Welcome!
        </h1>
        <p className="text-xl text-indigo-100 mb-8 px-4 md:px-16">
          Discover amazing deals and top-quality products at MyShop. We're thrilled to have you here!
        </p>
        <a 
          href="/products"
          className="bg-white hover:bg-gray-100 text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg"
        >
          Explore Products
        </a>
      </section>

      <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to MyShop!</h2>
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
