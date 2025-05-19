import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import OwnerProductList from '../components/products/OwnerProductList'; // Import the list
import AddProductForm from '../components/products/AddProductForm'; // Import the form

const OwnerDashboardPage = () => {
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  const handleProductAdded = () => {
    setShowAddProductForm(false);
    // Refresh the product list will happen automatically via the onSnapshot in OwnerProductList
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {showAddProductForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>

        {/* Add Product Form (conditionally rendered) */}
        {showAddProductForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Product</h3>
            <AddProductForm onProductAdded={handleProductAdded} />
          </div>
        )}

        {/* Product List Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <OwnerProductList />
        </div>
      </section>

      {/* Other Dashboard Sections */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Other Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Order Tracking</h2>
          <p className="text-gray-600">View and manage customer orders.</p>
          <Link 
            to="/admin/orders" 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-block"
          >
            View Orders
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Customer Messages</h2>
          <p className="text-gray-600">Respond to customer inquiries.</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            View Messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
