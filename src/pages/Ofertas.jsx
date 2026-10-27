// src/pages/Ofertas.jsx
import React, { useState, useEffect } from 'react';
import { getProductos } from '../services/dataService';
import PlatoCard from '../components/PlatoCard';
import ProductDetailModal from '../components/ProductDetailModal';

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [modalPlato, setModalPlato] = useState(null);

  useEffect(() => {
    const todos = getProductos();
    setOfertas(todos.filter(p => p.enOferta === true));
  }, []);

  return (
    <div className="py-5">
      <div className="container">
        <header className="mb-4 text-center py-4 bg-surface rounded border border-danger border-opacity-25 shadow-sm">
          <span className="badge bg-danger text-light text-uppercase fw-bold px-3 py-2 mb-2">
            Descuentos por Tiempo Limitado
          </span>
          <h1 className="display-5 fw-bold text-light brand-font mb-2">
            OFERTAS & PROMOCIONES <span className="text-warning">BISTRO</span>
          </h1>
          <p className="text-muted mx-auto mb-0" style={{ maxWidth: '600px' }}>
            Aprovecha nuestros precios especiales en barcos de sushi, combos imperiales y entradas seleccionadas.
          </p>
        </header>

        <div className="row g-4">
          {ofertas.map(plato => (
            <PlatoCard
              key={plato.id}
              plato={plato}
              onVerDetalle={(p) => setModalPlato(p)}
            />
          ))}
        </div>
      </div>

      {modalPlato && (
        <ProductDetailModal
          plato={modalPlato}
          onClose={() => setModalPlato(null)}
        />
      )}
    </div>
  );
}
