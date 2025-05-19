import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart(); // Use cart context
  const cartTotal = getCartTotal(); // Get total from context function

  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    } else {
      // Optionally, you could call removeFromCart(itemId) if quantity becomes 0
      // For now, just ensure it doesn't go below 1 with +/- buttons
      updateQuantity(itemId, 1); 
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-4">Your cart is currently empty.</p>
          <Link 
            to="/products"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th> 
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.imageUrl ? (
                           <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4"/>
                        ) : (
                           <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex items-center justify-center text-xs text-gray-500">No Image</div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          className="px-2 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                          disabled={item.quantity <= 1} // Disable if quantity is 1
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value, 10);
                            if (!isNaN(newQuantity) && newQuantity > 0) {
                              updateQuantity(item.id, newQuantity);
                            } else if (e.target.value === '') {
                                // Allow clearing the input, can decide later if it should default to 1 or remove
                            }
                          }}
                          onBlur={(e) => { // If input is empty on blur, reset to 1 or remove
                            if (e.target.value === '' || parseInt(e.target.value, 10) <= 0) {
                                updateQuantity(item.id, 1); // Or removeFromCart(item.id)
                            }
                          }}
                          className="w-12 text-center text-sm text-gray-900 border-gray-300 rounded-md mx-2"
                        />
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          className="px-2 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(item.price).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center">
              <Link 
                to="/products"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Continue Shopping
              </Link>
              
              <Link 
                to="/checkout"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-end">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Cart Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
              {/* Add shipping, taxes etc. here if needed */}
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                <span className="text-lg font-bold text-gray-800">${cartTotal.toFixed(2)}</span>
              </div>
              <button className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
