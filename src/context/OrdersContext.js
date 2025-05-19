import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const OrdersContext = createContext({
  orders: [],
  loading: true,
  error: null,
  createOrder: async () => {
    toast.error('Orders system is not initialized yet');
    return null;
  },
  updateOrderStatus: async () => {
    toast.error('Orders system is not initialized yet');
    return null;
  },
  deleteOrder: async () => {
    toast.error('Orders system is not initialized yet');
    return null;
  }
});

export const useOrders = () => {
  return useContext(OrdersContext);
};

export const OrdersProvider = ({ children }) => {
  const [state, setState] = useState({
    orders: [],
    loading: true,
    error: null
  });
  const { currentUser } = useAuth();

  // Load orders from Firestore
  useEffect(() => {
    const loadOrders = async () => {
      try {
        console.log('Attempting to load orders from Firestore...');
        
        // First check if Firebase is initialized
        if (!db || !currentUser) {
          throw new Error('Firebase not initialized or user not authenticated');
        }

        const q = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc')
        );

        // First try a direct get to verify collection exists
        const snapshot = await getDocs(q);
        console.log('Direct get returned:', snapshot.docs.length, 'documents');

        if (snapshot.empty) {
          console.log('No orders found in Firestore');
          setState({ orders: [], loading: false, error: null });
          return null;
        }

        // Now set up the real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
          try {
            console.log('Received snapshot with', snapshot.docs.length, 'documents');
            const ordersData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            console.log('Processed orders:', ordersData);
            setState({ orders: ordersData, loading: false, error: null });
          } catch (error) {
            console.error('Error processing orders snapshot:', error);
            setState(prev => ({ ...prev, error, loading: false }));
            toast.error('Failed to load orders. Please try refreshing the page.');
          }
        }, (error) => {
          console.error('Error in onSnapshot:', error);
          setState(prev => ({ ...prev, error, loading: false }));
          toast.error('Failed to load orders. Please try refreshing the page.');
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error in initial load:', error);
        setState({ orders: [], loading: false, error });
        toast.error('Failed to connect to Firestore. Please check your network connection.');
        return null;
      }
    };

    const unsubscribe = loadOrders();
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        console.log('Unsubscribing from orders snapshot');
        unsubscribe();
      }
    };
  }, [currentUser]);

  // Create new order
  const createOrder = async (orderData) => {
    try {
      if (!db || !currentUser) {
        throw new Error('Firebase not initialized or user not authenticated');
      }

      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        customerId: currentUser.uid,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
      throw error;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      if (!db || !currentUser) {
        throw new Error('Firebase not initialized or user not authenticated');
      }

      await updateDoc(doc(db, 'orders', orderId), {
        status: status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please try again.');
      throw error;
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      if (!db || !currentUser) {
        throw new Error('Firebase not initialized or user not authenticated');
      }

      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order. Please try again.');
      throw error;
    }
  };

  return (
    <OrdersContext.Provider value={{
      ...state,
      createOrder,
      updateOrderStatus,
      deleteOrder
    }}>
      {children}
    </OrdersContext.Provider>
  );
};
