// src/pages/Menu.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { getProductos, getCategorias } from '../services/dataService';
import PlatoCard from '../components/PlatoCard';
import ProductDetailModal from '../components/ProductDetailModal';

export default function Menu() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('defecto');
  const [modalPlato, setModalPlato] = useState(null);

  useEffect(() => {
    setProductos(getProductos());
    setCategorias(getCategorias());
  }, []);

  const productosFiltrados = useMemo(() => {
    let resultado = [...productos];

    if (categoriaActiva !== 'Todos') {
      resultado = resultado.filter(p => p.categoria === categoriaActiva);
    }

    if (busqueda.trim() !== '') {
      const q = busqueda.toLowerCase().trim();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      );
    }

    if (ordenPrecio === 'menor') {
      resultado.sort((a, b) => {
        const pA = a.enOferta && a.precioOferta ? a.precioOferta : a.precio;
        const pB = b.enOferta && b.precioOferta ? b.precioOferta : b.precio;
        return pA - pB;
      });
    } else if (ordenPrecio === 'mayor') {
      resultado.sort((a, b) => {
        const pA = a.enOferta && a.precioOferta ? a.precioOferta : a.precio;
        const pB = b.enOferta && b.precioOferta ? b.precioOferta : b.precio;
        return pB - pA;
      });
    }

    return resultado;
  }, [productos, categoriaActiva, busqueda, ordenPrecio]);

  return (
    <div className="py-5">
      <div className="container">
        <header className="mb-4">
          <span className="badge bg-warning text-dark text-uppercase fw-bold px-2 py-1 mb-2">
            Carta Gastronómica
          </span>
          <h1 className="h2 fw-bold text-light brand-font mb-1">CARTA DIGITAL COMPLETA</h1>
          <p className="text-muted small">
            Selecciona tus platos favoritos y añádelos directamente al carrito para despacho o retiro.
          </p>
        </header>

        {/* Barra de Filtros y Búsqueda */}
        <div className="row g-3 align-items-center mb-4">
          <div className="col-lg-6">
            <div className="input-group">
              <span className="input-group-text bg-card text-muted border-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
              </span>
              <input
                type="text"
                className="form-control bg-card text-light border-secondary"
                placeholder="Buscar plato, sushi, burger, bebida..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setBusqueda('')}
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="col-lg-3 col-md-6 ms-auto">
            <select
              className="form-select bg-card text-light border-secondary small"
              value={ordenPrecio}
              onChange={(e) => setOrdenPrecio(e.target.value)}
              aria-label="Ordenar por precio"
            >
              <option value="defecto">Ordenar por: Destacados</option>
              <option value="menor">Precio: Menor a Mayor</option>
              <option value="mayor">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Botones de Categorías */}
        <div className="d-flex flex-wrap gap-2 mb-4 pb-2 border-bottom border-secondary border-opacity-25">
          <button
            className={`btn btn-sm ${categoriaActiva === 'Todos' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setCategoriaActiva('Todos')}
          >
            Todos ({productos.length})
          </button>
          {categorias.map((cat, idx) => {
            const count = productos.filter(p => p.categoria === cat).length;
            return (
              <button
                key={idx}
                className={`btn btn-sm ${categoriaActiva === cat ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
                onClick={() => setCategoriaActiva(cat)}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Grilla de Productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-5 bg-card rounded border border-secondary border-opacity-25">
            <p className="text-muted fs-5 mb-2">No se encontraron productos coincidentes.</p>
            <button
              className="btn btn-outline-warning btn-sm"
              onClick={() => {
                setCategoriaActiva('Todos');
                setBusqueda('');
              }}
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {productosFiltrados.map(plato => (
              <PlatoCard
                key={plato.id}
                plato={plato}
                onVerDetalle={(p) => setModalPlato(p)}
              />
            ))}
          </div>
        )}
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
