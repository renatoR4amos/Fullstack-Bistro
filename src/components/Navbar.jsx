// src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { totalItems, totalPrice, setIsCartOpen } = useCart();
  const { currentUser, logout, isAdmin } = useAuth();

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top py-2">
        <div className="container">
          <Link className="navbar-brand text-uppercase fw-bold" to="/">
            BISTRO <span>& BARRA</span>
          </Link>

          <div className="d-flex align-items-center order-lg-3 ms-auto ms-lg-3 gap-2">
            {/* Botón Carrito */}
            <button
              className="btn btn-carrito-nav text-decoration-none d-flex align-items-center"
              onClick={() => setIsCartOpen(true)}
              aria-label="Ver carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart3 me-1" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              <span className="badge bg-warning text-dark fw-bold rounded-pill me-1 badge-carrito-total">
                {totalItems}
              </span>
              <span className="small d-none d-sm-inline fw-semibold text-warning">
                ${totalPrice.toLocaleString('es-CL')}
              </span>
            </button>

            {/* Sesión de Usuario */}
            {currentUser ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary btn-sm dropdown-toggle text-light py-1 px-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="text-warning fw-semibold">{currentUser.nombre.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                  <li><span className="dropdown-item-text small text-muted">RUT: {currentUser.rut}</span></li>
                  <li><span className="dropdown-item-text small text-warning">{currentUser.rol}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  {isAdmin && (
                    <li><Link className="dropdown-item" to="/admin">Panel Staff</Link></li>
                  )}
                  <li><button className="dropdown-item text-danger" onClick={logout}>Cerrar Sesión</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/registro" className="btn btn-outline-warning btn-sm py-1 px-3">
                Ingresar
              </Link>
            )}

            <button
              className="navbar-toggler ms-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#menuNav"
              aria-controls="menuNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse order-lg-2" id="menuNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/menu">
                  Carta Digital
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/registro">
                  Reservas
                </NavLink>
              </li>
              <li className="nav-item ms-lg-2">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active text-warning fw-bold' : 'text-secondary small'}`} to="/admin">
                  Staff
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
