// src/pages/OrderError.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getOrdenByCodigo } from '../services/dataService';

export default function OrderError() {
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get('codigo') || '20240705';
  const [orden, setOrden] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const encontrada = getOrdenByCodigo(codigo);
    if (encontrada) {
      setOrden(encontrada);
    } else {
      setOrden({
        codigo: codigo,
        cliente: {
          nombre: 'Pedro',
          apellidos: 'Hacker',
          correo: 'pedro.hacker20@example.com'
        },
        direccion: {
          calle: 'Los Crisantemos, Edificio Norte',
          departamento: 'Depto 603',
          region: 'Región Metropolitana de Santiago',
          comuna: 'Cerrillos',
          indicaciones: 'El martes no estaremos en el depto, pero puede dejárselo con el conserje.'
        },
        items: [
          { id: 1, nombre: 'Promo 50 Piezas Mixtas', precio: 14990, cantidad: 1, subtotal: 14990, imagen: '/img/hero-promo50.jpg' },
          { id: 11, nombre: 'Limonada Menta Jengibre', precio: 3500, cantidad: 2, subtotal: 7000, imagen: '/img/bebida_limonada.jpg' },
          { id: 9, nombre: 'Salchipapas Supremas', precio: 6990, cantidad: 1, subtotal: 6990, imagen: '/img/sagrado_bajon_salchipapas.jpg' }
        ],
        total: 28980
      });
    }
  }, [codigo]);

  if (!orden) return null;

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="card bg-card border-danger border-opacity-50 p-4 p-md-5 shadow-lg">
          {/* Encabezado de Error (Figura 8 de la pauta) */}
          <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
            <span className="badge bg-danger rounded-circle p-2 fs-6">✕</span>
            <div>
              <h1 className="h3 brand-font text-danger mb-0">
                NO SE PUDO REALIZAR EL PAGO. NRO #{orden.codigo}
              </h1>
              <small className="text-muted">
                La entidad bancaria o pasarela de pago rechazó la transacción. Por favor, revisa tus fondos o intenta con otro medio de pago.
              </small>
            </div>
          </div>

          {/* Botón Volver a Realizar el Pago */}
          <div className="text-center my-3">
            <button
              className="btn btn-success btn-lg px-5 py-3 fw-bold text-uppercase shadow"
              onClick={() => navigate('/checkout')}
            >
              Volver a Realizar el Pago
            </button>
          </div>

          <div className="my-3">
            <h2 className="h6 text-muted text-uppercase fw-bold mb-3">Detalle de compra</h2>

            {/* Información del Cliente */}
            <div className="bg-surface rounded p-3 mb-3 border border-secondary border-opacity-25">
              <div className="row g-2 small text-light">
                <div className="col-sm-4">
                  <span className="text-muted d-block">Nombre:</span>
                  <strong>{orden.cliente?.nombre}</strong>
                </div>
                <div className="col-sm-4">
                  <span className="text-muted d-block">Apellidos:</span>
                  <strong>{orden.cliente?.apellidos}</strong>
                </div>
                <div className="col-sm-4">
                  <span className="text-muted d-block">Correo:</span>
                  <strong className="text-truncate d-block">{orden.cliente?.correo}</strong>
                </div>
              </div>
            </div>

            {/* Dirección de Entrega */}
            <div className="bg-surface rounded p-3 mb-4 border border-secondary border-opacity-25">
              <div className="row g-2 small text-light">
                <div className="col-sm-8">
                  <span className="text-muted d-block">Calle:</span>
                  <strong>{orden.direccion?.calle}</strong>
                </div>
                <div className="col-sm-4">
                  <span className="text-muted d-block">Departamento:</span>
                  <strong>{orden.direccion?.departamento || 'No especificado'}</strong>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted d-block">Región:</span>
                  <strong>{orden.direccion?.region}</strong>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted d-block">Comuna:</span>
                  <strong>{orden.direccion?.comuna}</strong>
                </div>
                <div className="col-12 mt-2">
                  <span className="text-muted d-block">Indicaciones para la entrega:</span>
                  <span className="fst-italic text-secondary">{orden.direccion?.indicaciones || 'Sin indicaciones adicionales'}</span>
                </div>
              </div>
            </div>

            {/* Tabla de Productos */}
            <div className="table-responsive mb-3">
              <table className="table table-dark table-sm align-middle mb-0">
                <thead className="table-secondary small text-uppercase">
                  <tr>
                    <th style={{ width: '50px' }}>Imagen</th>
                    <th>Nombre</th>
                    <th className="text-end">Precio</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orden.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td>
                        <img
                          src={it.imagen || '/img/hero-ceviche.jpg'}
                          alt=""
                          style={{ width: '38px', height: '28px', objectFit: 'cover', borderRadius: '3px' }}
                        />
                      </td>
                      <td><strong className="text-light">{it.nombre}</strong></td>
                      <td className="text-end text-muted small">${it.precio?.toLocaleString('es-CL')}</td>
                      <td className="text-center fw-bold">{it.cantidad}</td>
                      <td className="text-end text-warning fw-bold">${it.subtotal?.toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="text-center py-3 bg-surface rounded border border-secondary border-opacity-25">
              <h3 className="h4 brand-font text-light mb-0">
                TOTAL PENDIENTE: <span className="text-danger">${orden.total?.toLocaleString('es-CL')}</span>
              </h3>
            </div>
          </div>

          <div className="text-center mt-3">
            <Link to="/menu" className="btn btn-outline-secondary btn-sm px-4">
              Cancelar y Volver al Menú
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
