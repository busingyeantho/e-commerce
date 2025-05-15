import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  
  // Get a unique key for the current user's cart
  const getCartKey = () => {
    return currentUser ? `cart_${currentUser.uid}` : 'cart_guest';
  };

  // Load cart from localStorage when component mounts or user changes
  useEffect(() => {
    const loadCart = () => {
      const cartKey = getCartKey();
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart data:', error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    
    loadCart();
  }, [currentUser, getCartKey]); // Re-run when user changes or getCartKey changes

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0 || localStorage.getItem(getCartKey())) {
      localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser, getCartKey]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        toast.success(`${product.name} quantity updated in cart!`);
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        toast.success(`${product.name} added to cart!`);
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Placeholder for removeFromCart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      toast.error('Item removed from cart.'); // Example toast
      return prevItems.filter(item => item.id !== productId);
    });
  };

  // Placeholder for updateQuantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems => {
      toast.success('Cart updated!');
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(getCartKey());
    toast.success('Cart cleared!');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };
  
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
