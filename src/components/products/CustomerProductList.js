import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';

// Placeholder for a single product card - consider moving to its own component file if it grows
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
      ) : (
        <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={product.name}>{product.name}</h3>
        <p className="text-gray-600 text-sm mb-1 truncate">{product.category}</p>
        <p className="text-gray-500 text-xs mb-3 h-10 overflow-hidden">{product.description || 'No description available.'}</p>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-indigo-600">${parseFloat(product.price).toFixed(2)}</p>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm"
            onClick={() => alert(`TODO: Add ${product.name} to cart`)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomerProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Query to get products, ordered by creation date, limited for display
    const q = query(collection(db, 'products'), orderBy("createdAt", "desc"), limit(20)); // Example: limit to 20 products

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ ...doc.data(), id: doc.id });
      });
      setProducts(productsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products for customers: ", err);
      setError("Failed to load products. Please try again soon.");
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading awesome products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-500 py-10">No products available at the moment. Check back soon!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CustomerProductList;
