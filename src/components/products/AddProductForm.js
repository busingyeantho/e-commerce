import React, { useState } from 'react';
import { db } from '../../firebase';
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
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Convert image file to base64 string (for small images only)
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }
      
      // Check file size - limit to 500KB to avoid Firestore document size limits
      if (file.size > 500 * 1024) {
        reject(new Error('File size exceeds 500KB limit for direct upload. Please use an image URL instead.'));
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
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
      let imageUrl = product.imageUrl;
      
      // If user provided an image URL, prioritize that over uploaded file
      if (product.imageUrl && product.imageUrl.trim() !== '') {
        // Use the URL directly
        imageUrl = product.imageUrl.trim();
      }
      // Otherwise, if user uploaded an image file, convert it to base64
      else if (imageFile) {
        try {
          imageUrl = await getBase64(imageFile);
          // Note: For production, you should use a proper image hosting service
          // Base64 encoding is only suitable for small images and testing
        } catch (error) {
          console.error('Image processing error:', error);
          toast.error(`Failed to process image: ${error.message}`);
          setLoading(false);
          return; // Don't proceed if image processing fails
        }
      }

      // Add product to Firestore
      await addDoc(collection(db, 'products'), {
        ...product,
        imageUrl, // Use the base64 image or URL
        price: parseFloat(product.price),
        stockQuantity: parseInt(product.stockQuantity),
        ownerId: currentUser ? currentUser.uid : 'anonymous',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Product added successfully!');
      setProduct({ name: '', description: '', price: '', imageUrl: '', category: '', stockQuantity: '' });
      setImageFile(null);
      setImagePreview('');
      
      if (onProductAdded) {
        onProductAdded();
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
        <label className="block text-sm font-medium text-gray-700">Product Image (max 500KB)</label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {imagePreview && (
            <div className="relative w-24 h-24">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">Upload a small image (under 500KB) or provide an image URL below</p>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (recommended)</label>
        <input type="url" name="imageUrl" id="imageUrl" value={product.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <p className="mt-1 text-xs text-gray-500">For best results, use a direct image URL from a service like Imgur, Unsplash, or similar</p>
      </div>

      <div>
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
