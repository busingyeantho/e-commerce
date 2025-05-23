import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import ChatPage from './pages/ChatPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminSetupPage from './pages/AdminSetupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Navbar Component (Consider moving to src/components/layout/Navbar.js later)
const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out. Please try again.');
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-indigo-300 transition-colors">MyShop</Link>
        <div className="space-x-4">
          <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Home</Link>
          <Link to="/products" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Products</Link>
          
          {currentUser ? (
            <>
              <Link to="/cart" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Cart</Link>
              {/* Only show Dashboard link to users with owner role */}
              {currentUser.role === 'owner' && (
                <Link to="/owner/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Dashboard</Link>
              )}
              <Link to="/chat" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Chat</Link>
              <Link to="/admin-setup" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Admin Setup</Link>
              <button 
                onClick={handleLogout} 
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
              {currentUser.email && <span className="px-3 py-2 text-sm text-gray-300">{currentUser.email}</span>}
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Login</Link>
              <Link to="/signup" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-200 text-center p-4 mt-8">
    <p>&copy; {new Date().getFullYear()} MyShop. All rights reserved.</p>
  </footer>
);

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <OrdersProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/owner/dashboard" element={<ProtectedRoute roles={['owner']}><OwnerDashboardPage /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute roles={['admin', 'owner']}><AdminOrdersPage /></ProtectedRoute>} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/admin-setup" element={<AdminSetupPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </OrdersProvider>
    </Router>
  );
};

export default App;
