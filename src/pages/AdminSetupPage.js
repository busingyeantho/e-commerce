import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminSetupPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Check if the current user is already an admin
    if (currentUser && currentUser.role === 'owner') {
      setAdminExists(true);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // First, find the user document with this email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast.error('No user found with this email address');
        setLoading(false);
        return;
      }

      // Get the first matching user
      const userDoc = querySnapshot.docs[0];
      
      // Update the user's role to 'owner'
      await updateDoc(doc(db, 'users', userDoc.id), {
        role: 'owner'
      });
      
      toast.success(`User ${email} has been granted owner privileges`);
      setEmail('');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Admin Setup</h1>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Admin Setup</h1>
      
      {adminExists ? (
        <div>
          <p className="mb-4 text-green-600">You already have owner privileges.</p>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Grant Owner Access</h2>
            <p className="mb-4">Use this form to grant owner privileges to another user.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">User Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="user@example.com"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Grant Owner Access'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-red-600">You do not have permission to access this page.</p>
      )}
    </div>
  );
};

export default AdminSetupPage;
