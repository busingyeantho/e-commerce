import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { createOrder, loading: ordersLoading, error: ordersError } = useOrders();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Calculate total
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Handle checkout
  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error('Please log in to proceed with checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/products');
      return;
    }

    try {
      setLoading(true);
      
      // Create order in Firestore
      const orderData = {
        customerName: currentUser.displayName || currentUser.email.split('@')[0],
        customerEmail: currentUser.email,
        items: cartItems,
        totalAmount: cartTotal,
        status: 'pending',
        shippingAddress: {
          // TODO: Add actual shipping address collection
          address: 'Not provided',
          city: 'Not provided',
          country: 'Not provided'
        }
      };

      if (ordersLoading) {
        toast.error('Orders system is still initializing. Please wait a moment and try again.');
        return;
      }

      if (ordersError) {
        toast.error('Failed to connect to orders system. Please refresh the page and try again.');
        return;
      }

      const orderId = await createOrder(orderData);
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If orders context is still loading, show a loading state
  if (ordersLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2">Loading orders system...</p>
        </div>
      </div>
    );
  }

  // If there's an error with orders context, show an error message
  if (ordersError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading orders system. Please refresh the page and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="font-semibold">
                ${item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link 
          to="/cart"
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Back to Cart
        </Link>
        
        <button
          onClick={handleCheckout}
          disabled={loading || cartItems.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Complete Order'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
