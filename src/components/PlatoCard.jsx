// src/components/PlatoCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

export default function PlatoCard({ plato, onVerDetalle }) {
  const { addToCart } = useCart();
  const precioFinal = plato.enOferta && plato.precioOferta ? plato.precioOferta : plato.precio;

  return (
    <div className="col-md-6 col-lg-4 d-flex">
      <div className="card w-100 card-plato shadow-sm border-secondary border-opacity-25 bg-surface text-light d-flex flex-column position-relative">
        {plato.enOferta && (
          <span className="position-absolute top-0 end-0 badge bg-danger m-2 py-1 px-2 fw-bold text-uppercase shadow">
            Oferta Especial
          </span>
        )}
        {plato.stock <= plato.stockCritico && (
          <span className="position-absolute top-0 start-0 badge bg-warning text-dark m-2 py-1 px-2 fw-bold shadow">
            Últimas {plato.stock} unidades
          </span>
        )}

        <img
          src={plato.imagen}
          className="card-img-top"
          alt={plato.nombre}
          style={{ height: '200px', objectFit: 'cover' }}
          loading="lazy"
        />

        <div className="card-body d-flex flex-column p-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="badge bg-secondary bg-opacity-50 text-warning text-uppercase small">
              {plato.categoria}
            </span>
            <div className="text-end">
              {plato.enOferta && plato.precioOferta ? (
                <>
                  <small className="text-decoration-line-through text-muted me-2 small">
                    ${plato.precio.toLocaleString('es-CL')}
                  </small>
                  <span className="fw-bold text-warning fs-5">
                    ${plato.precioOferta.toLocaleString('es-CL')}
                  </span>
                </>
              ) : (
                <span className="fw-bold text-warning fs-5">
                  ${plato.precio.toLocaleString('es-CL')}
                </span>
              )}
            </div>
          </div>

          <h3 className="h5 card-title fw-bold text-light mb-2">{plato.nombre}</h3>
          <p className="card-text text-muted small flex-grow-1 card-desc" style={{ minHeight: '48px' }}>
            {plato.desc}
          </p>

          <div className="d-flex gap-2 mt-3 pt-2 border-top border-secondary border-opacity-25">
            <button
              className="btn btn-outline-light btn-sm flex-grow-1"
              onClick={() => onVerDetalle && onVerDetalle(plato)}
            >
              Detalles
            </button>
            <button
              className="btn btn-neon btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              onClick={() => addToCart(plato, 1)}
              aria-label={`Añadir ${plato.nombre} al carrito`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
