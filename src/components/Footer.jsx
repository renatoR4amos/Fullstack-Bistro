// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-bistro mt-auto py-5 border-top border-secondary border-opacity-25 bg-dark">
      <div className="container">
        <div className="row g-4 text-light">
          <div className="col-lg-4 col-md-6">
            <h4 className="brand-font text-warning mb-3">BISTRO RESTAURANTE</h4>
            <p className="text-muted small">
              Gastronomía de autor, sushi artesanal y coctelería contemporánea.
              Calidad y frescura en cada servicio.
            </p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold text-uppercase small text-warning mb-3">Navegación</h5>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-decoration-none text-muted">Inicio</Link></li>
              <li className="mb-2"><Link to="/menu" className="text-decoration-none text-muted">Carta Digital</Link></li>
              <li className="mb-2"><Link to="/registro" className="text-decoration-none text-muted">Reservas</Link></li>
              <li className="mb-2"><Link to="/admin" className="text-decoration-none text-muted">Staff</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold text-uppercase small text-warning mb-3">Horario y Atención</h5>
            <ul className="list-unstyled small text-muted">
              <li className="mb-1"><strong>Lunes a Jueves:</strong> 12:30 - 23:00 hrs</li>
              <li className="mb-1"><strong>Viernes y Sábado:</strong> 12:30 - 01:00 hrs</li>
              <li className="mb-1"><strong>Domingos:</strong> 12:30 - 21:00 hrs</li>
              <li className="mt-2 text-warning fw-semibold">Delivery y Retiro en Local</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold text-uppercase small text-warning mb-3">Ubicación & Contacto</h5>
            <p className="small text-muted mb-1">Av. Las Condes 12450, Santiago, Chile</p>
            <p className="small text-muted mb-1">Teléfono: +56 2 2987 6543</p>
            <p className="small text-muted mb-3">Email: contacto@bistrorestaurante.cl</p>
            <Link to="/admin" className="btn btn-outline-warning btn-sm py-1 px-3">
              Acceso Staff
            </Link>
          </div>
        </div>

        <hr className="my-4 border-secondary border-opacity-25" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-muted">
          <span>&copy; {new Date().getFullYear()} BISTRO Restaurante. Todos los derechos reservados.</span>
          <span className="mt-2 mt-sm-0">Plataforma Web React</span>
        </div>
      </div>
    </footer>
  );
}
