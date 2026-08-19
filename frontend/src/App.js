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
import { CartProvider } from './context/CartContext';
import { Toaster } from './components/ui/toaster';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/:slug" element={<TemplateDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/compare" element={<CompareHub />} />
            <Route path="/compare/:slug" element={<CompareDetail />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/tools" element={<Tools />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
