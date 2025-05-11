import React from 'react';
import CustomerProductList from '../components/products/CustomerProductList';

const ProductsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Products</h1>
      <p className="text-gray-600 mb-8 text-center">Browse our collection of high-quality products.</p>
      <CustomerProductList />
    </div>
  );
};

export default ProductsPage;
