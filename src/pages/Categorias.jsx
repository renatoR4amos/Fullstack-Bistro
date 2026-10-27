// src/pages/Categorias.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductos, getCategorias } from '../services/dataService';
import PlatoCard from '../components/PlatoCard';
import ProductDetailModal from '../components/ProductDetailModal';

export default function Categorias() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat');

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(catParam || 'Todos');
  const [modalPlato, setModalPlato] = useState(null);

  useEffect(() => {
    setCategorias(getCategorias());
    setProductos(getProductos());
  }, []);

  useEffect(() => {
    if (catParam) {
      setCategoriaSeleccionada(catParam);
    }
  }, [catParam]);

  const handleSelectCategoria = (cat) => {
    setCategoriaSeleccionada(cat);
    if (cat === 'Todos') {
      setSearchParams({});
    } else {
      setSearchParams({ cat });
    }
  };

  const productosFiltrados = categoriaSeleccionada === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div className="py-5">
      <div className="container">
        <header className="mb-4">
          <span className="badge bg-warning text-dark text-uppercase fw-bold px-2 py-1 mb-2">
            Módulo de Navegación
          </span>
          <h1 className="h2 fw-bold text-light brand-font mb-1">CATEGORÍAS DE PRODUCTOS</h1>
          <p className="text-muted small">
            Explora la oferta del bistró organizada por familias gastronómicas.
          </p>
        </header>

        {/* Bloques de Categorías (Figura 4 de la pauta) */}
        <div className="row g-3 mb-5">
          <div className="col-6 col-md-4 col-lg-2">
            <div
              className={`card h-100 text-center p-3 cursor-pointer border ${categoriaSeleccionada === 'Todos' ? 'border-warning bg-surface shadow' : 'border-secondary border-opacity-25 bg-card'}`}
              onClick={() => handleSelectCategoria('Todos')}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div className="text-warning fw-bold small text-uppercase">Todas</div>
              <div className="fs-4 fw-bold text-light mt-1">{productos.length}</div>
              <small className="text-muted">Platos totales</small>
            </div>
          </div>

          {categorias.map((cat, idx) => {
            const count = productos.filter(p => p.categoria === cat).length;
            const activa = categoriaSeleccionada === cat;
            return (
              <div key={idx} className="col-6 col-md-4 col-lg-2">
                <div
                  className={`card h-100 text-center p-3 cursor-pointer border ${activa ? 'border-warning bg-surface shadow' : 'border-secondary border-opacity-25 bg-card'}`}
                  onClick={() => handleSelectCategoria(cat)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  <div className="text-warning fw-bold small text-uppercase text-truncate" title={cat}>
                    {cat}
                  </div>
                  <div className="fs-4 fw-bold text-light mt-1">{count}</div>
                  <small className="text-muted">Variedades</small>
                </div>
              </div>
            );
          })}
        </div>

        {/* Listado de Productos de la Categoría */}
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
          <h2 className="h4 brand-font text-light mb-0">
            {categoriaSeleccionada.toUpperCase()} ({productosFiltrados.length})
          </h2>
          {categoriaSeleccionada !== 'Todos' && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleSelectCategoria('Todos')}
            >
              Ver Todas las Categorías
            </button>
          )}
        </div>

        <div className="row g-4">
          {productosFiltrados.map(plato => (
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
