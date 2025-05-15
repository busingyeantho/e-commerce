import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { collection, query, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { toast } from 'react-hot-toast';

const OwnerProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'products'), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ ...doc.data(), id: doc.id });
      });
      setProducts(productsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products: ", err);
      setError("Failed to load products. Please try again later.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    setDeletingProduct(product.id);
    try {
      // Delete the product document from Firestore
      await deleteDoc(doc(db, 'products', product.id));

      // If there's an image URL and it's from Firebase Storage, delete it too
      if (product.imageUrl && product.imageUrl.includes('firebasestorage.googleapis.com')) {
        try {
          // Extract the path from the URL
          const imageRef = ref(storage, product.imageUrl);
          await deleteObject(imageRef);
        } catch (imageError) {
          console.error("Error deleting image: ", imageError);
          // Continue even if image deletion fails
        }
      }

      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setDeletingProduct(null);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-500">No products found. Add your first product!</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                {product.imageUrl && 
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded mt-1" />
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(product.price).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stockQuantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleDelete(product)}
                  disabled={deletingProduct === product.id}
                >
                  {deletingProduct === product.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerProductList;
