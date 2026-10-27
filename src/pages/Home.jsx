// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductos, getCategorias } from '../services/dataService';
import PlatoCard from '../components/PlatoCard';
import ProductDetailModal from '../components/ProductDetailModal';

export default function Home() {
  const [destacados, setDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalPlato, setModalPlato] = useState(null);

  useEffect(() => {
    const todos = getProductos();
    setDestacados(todos.slice(0, 6));
    setCategorias(getCategorias());
  }, []);

  return (
    <div>
      {/* Hero Portada */}
      <section className="hero-section text-center py-5 position-relative overflow-hidden">
        <div className="container py-4">
          <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold mb-3 tracking-wide">
            ALTA GASTRONOMÍA & COCTELERÍA
          </span>
          <h1 className="hero-title fw-bold mb-3 display-3">
            SABOR <span className="text-warning">REAL</span> & BARRA
          </h1>
          <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '680px' }}>
            Descubre nuestra propuesta bistró contemporánea con rolls artesanales,
            hamburguesas smash de vacuno, mariscos seleccionados y coctelería fresca.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/menu" className="btn btn-neon px-4 py-2 fw-bold">
              Ver Carta Digital
            </Link>
            <Link to="/registro" className="btn btn-neon-outline px-4 py-2 fw-bold">
              Reservar una Mesa
            </Link>
          </div>
        </div>
      </section>

      {/* Banner de Categorías Destacadas (Figura 1 & 4 de la pauta) */}
      <section className="py-5 border-top border-bottom border-secondary border-opacity-25 bg-surface">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="h3 brand-font text-light mb-1">CATEGORÍAS DE LA CARTA</h2>
              <p className="text-muted small mb-0">Selecciona una categoría para explorar los productos</p>
            </div>
            <Link to="/menu" className="btn btn-outline-warning btn-sm">
              Ver Carta Completa &rarr;
            </Link>
          </div>

          <div className="row g-3">
            {categorias.slice(0, 4).map((cat, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <Link
                  to="/menu"
                  className="card text-decoration-none bg-card border-secondary border-opacity-25 text-center p-4 h-100 hover-card"
                >
                  <div className="display-6 text-warning mb-2 font-monospace">0{idx + 1}</div>
                  <h3 className="h6 text-light fw-bold text-uppercase mb-0">{cat}</h3>
                  <small className="text-muted mt-1 d-block">Explorar platos</small>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platos Destacados */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="h3 brand-font text-light mb-1">PLATOS DESTACADOS</h2>
              <p className="text-muted small mb-0">Especialidades más solicitadas por nuestros comensales</p>
            </div>
            <Link to="/menu" className="btn btn-outline-light btn-sm">
              Ver Carta Completa
            </Link>
          </div>

          <div className="row g-4">
            {destacados.map(plato => (
              <PlatoCard
                key={plato.id}
                plato={plato}
                onVerDetalle={(p) => setModalPlato(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sección Experiencia Bistro */}
      <section className="py-5 bg-surface border-top border-secondary border-opacity-25">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="display-5 brand-font text-light mb-3">
                COCINA ABIERTA & <span className="text-warning">MATERIA PRIMA FRESCA</span>
              </h2>
              <p className="text-muted">
                En BISTRO elaboramos cada preparación al instante. Pescados frescos seleccionados en caleta,
                carnes Angus maduradas y panes brioche horneados artesanalmente cada mañana.
              </p>
              <ul className="list-unstyled text-light small mb-4">
                <li className="mb-2"><strong>Ingredientes 100% naturales</strong> sin conservantes artificiales.</li>
                <li className="mb-2"><strong>Empaques sustentables</strong> biodegradables para delivery.</li>
                <li className="mb-2"><strong>Atención personalizada</strong> y opciones para dietas especiales.</li>
              </ul>
              <Link to="/registro" className="btn btn-neon px-4 py-2">
                Agendar Visita al Restaurante
              </Link>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="/img/local_real.jpg"
                alt="Ambiente Bistro Restaurante"
                className="img-fluid rounded shadow-lg border border-secondary border-opacity-25"
                style={{ maxHeight: '380px', width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Detalle */}
      {modalPlato && (
        <ProductDetailModal
          plato={modalPlato}
          onClose={() => setModalPlato(null)}
        />
      )}
    </div>
  );
}
