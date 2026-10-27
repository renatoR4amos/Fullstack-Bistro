// src/components/ProductDetailModal.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ plato, onClose }) {
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);

  if (!plato) return null;

  const precioFinal = plato.enOferta && plato.precioOferta ? plato.precioOferta : plato.precio;

  const handleAdd = () => {
    addToCart(plato, cantidad);
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-card text-light border-secondary">
          <div className="modal-header border-secondary border-opacity-25">
            <h4 className="modal-title brand-font text-warning">{plato.nombre}</h4>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-4 align-items-center">
              <div className="col-md-6 text-center">
                <img
                  src={plato.imagen}
                  alt={plato.nombre}
                  className="img-fluid rounded shadow border border-secondary border-opacity-25"
                  style={{ maxHeight: '280px', width: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-secondary text-warning text-uppercase">{plato.categoria}</span>
                  <span className="small text-muted">Stock actual: {plato.stock} unid.</span>
                </div>

                <div className="mb-3">
                  {plato.enOferta && plato.precioOferta ? (
                    <div className="d-flex align-items-baseline gap-2">
                      <span className="fs-3 fw-bold text-warning">${plato.precioOferta.toLocaleString('es-CL')}</span>
                      <span className="text-decoration-line-through text-muted small">${plato.precio.toLocaleString('es-CL')}</span>
                      <span className="badge bg-danger">OFERTA</span>
                    </div>
                  ) : (
                    <span className="fs-3 fw-bold text-warning">${plato.precio.toLocaleString('es-CL')}</span>
                  )}
                </div>

                <p className="text-muted small mb-4 leading-relaxed">{plato.desc}</p>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <label className="text-muted small fw-semibold">Cantidad:</label>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-secondary btn-sm px-3"
                      onClick={() => setCantidad(c => Math.max(1, c - 1))}
                    >
                      -
                    </button>
                    <span className="btn btn-outline-secondary btn-sm disabled text-light fw-bold px-3">
                      {cantidad}
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm px-3"
                      onClick={() => setCantidad(c => Math.min(plato.stock || 20, c + 1))}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-warning fw-bold small">
                    Total: ${(precioFinal * cantidad).toLocaleString('es-CL')}
                  </span>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary flex-grow-1" onClick={onClose}>
                    Cerrar
                  </button>
                  <button className="btn btn-neon flex-grow-1" onClick={handleAdd}>
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
