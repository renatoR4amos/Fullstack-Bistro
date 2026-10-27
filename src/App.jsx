// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartModal from './components/CartModal';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderError from './pages/OrderError';
import Registro from './pages/Registro';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago-exitoso" element={<OrderSuccess />} />
          <Route path="/pago-error" element={<OrderError />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <CartModal />
      <Footer />
    </div>
  );
}
