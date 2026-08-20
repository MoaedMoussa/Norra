import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Templates from './pages/Templates';
import TemplateDetail from './pages/TemplateDetail';
import Cart from './pages/Cart';
import CompareHub from './pages/CompareHub';
import CompareDetail from './pages/CompareDetail';
import { Tutorials, Tools } from './pages/Info';
import Library from './pages/Library';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Admin from './pages/Admin';
import AuthCallback from './pages/AuthCallback';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRouter() {
  const location = useLocation();
  // OAuth callback via URL fragment — intercept BEFORE routes render
  if (location.hash?.includes('session_id=')) return <AuthCallback />;
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:slug" element={<TemplateDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/library" element={<Library />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/compare" element={<CompareHub />} />
        <Route path="/compare/:slug" element={<CompareDetail />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/tools" element={<Tools />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App paper-grain">
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRouter />
            <Toaster />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
