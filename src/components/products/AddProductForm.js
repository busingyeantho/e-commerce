import React, { useState } from 'react';
import { db, auth } from '../../firebase'; // Assuming auth is needed for ownerId
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const AddProductForm = ({ onProductAdded }) => {
  const { currentUser } = useAuth();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stockQuantity: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('You must be logged in to add products.');
      return;
    }

    // Basic validation
    if (!product.name || !product.price || !product.stockQuantity || !product.category) {
      toast.error('Please fill in all required fields: Name, Price, Stock, Category.');
      return;
    }
    if (isNaN(parseFloat(product.price)) || isNaN(parseInt(product.stockQuantity))) {
      toast.error('Price and Stock Quantity must be valid numbers.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        price: parseFloat(product.price),
        stockQuantity: parseInt(product.stockQuantity),
        ownerId: currentUser.uid, // Associate product with the owner
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Product added successfully!');
      setProduct({ name: '', description: '', price: '', imageUrl: '', category: '', stockQuantity: '' });
      if (onProductAdded) {
        onProductAdded(); // Callback to inform parent (e.g., to hide form/refresh list)
      }
    } catch (error) {
      console.error("Error adding product: ", error);
      toast.error(`Failed to add product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name *</label>
        <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" id="description" value={product.description} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price *</label>
          <input type="number" name="price" id="price" value={product.price} onChange={handleChange} required step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
          <input type="number" name="stockQuantity" id="stockQuantity" value={product.stockQuantity} onChange={handleChange} required step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
        <input type="text" name="category" id="category" value={product.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
        <input type="url" name="imageUrl" id="imageUrl" value={product.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <p className="mt-1 text-xs text-gray-500">Paste a URL to an image. Direct image uploads will be supported later.</p>
      </div>
      <div>
        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
