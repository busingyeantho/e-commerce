import React, { useState } from 'react';
import AddProductForm from '../components/products/AddProductForm'; // Import the form
import OwnerProductList from '../components/products/OwnerProductList'; // Import the list

const OwnerDashboardPage = () => {
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  const handleProductAdded = () => {
    setShowAddProductForm(false);
    // Later: refresh product list here
    // console.log("Product added, refresh list!"); 
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Owner Dashboard</h1>
      
      {/* Product Management Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Product Management</h2>
          <button 
            onClick={() => setShowAddProductForm(!showAddProductForm)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            {showAddProductForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>

        {/* Add Product Form (conditionally rendered) */}
        {showAddProductForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Product</h3>
            {/* Placeholder for AddProductForm component */}
            {/* <p className="text-gray-600">AddProductForm component will go here.</p> */}
            <AddProductForm onProductAdded={handleProductAdded} />
          </div>
        )}

        {/* Product List Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Products</h3>
          <OwnerProductList />
        </div>
      </section>

      {/* Other Dashboard Sections (Orders, Chat, etc. - can be added later or kept as is) */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Other Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Order Tracking</h2>
          <p className="text-gray-600 mb-4">View and process customer orders.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
            View Orders
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Customer Chat</h2>
          <p className="text-gray-600 mb-4">Respond to customer inquiries.</p>
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
            Open Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
