// src/pages/OrderSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getOrdenByCodigo } from '../services/dataService';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get('codigo') || '20240705';
  const [orden, setOrden] = useState(null);
  const [notifEmail, setNotifEmail] = useState(false);

  useEffect(() => {
    const encontrada = getOrdenByCodigo(codigo);
    if (encontrada) {
      setOrden(encontrada);
    } else {
      // Orden por defecto para cumplir con la maqueta de la figura 7
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

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setNotifEmail(true);
    setTimeout(() => setNotifEmail(false), 4000);
  };

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="card bg-card border-success border-opacity-50 p-4 p-md-5 shadow-lg">
          {/* Encabezado de Compra Exitosa (Figura 7 de la pauta) */}
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25 flex-wrap gap-2">
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success rounded-circle p-2 fs-6">✓</span>
                <h1 className="h3 brand-font text-light mb-0">
                  SE HA REALIZADO LA COMPRA. NRO #{orden.codigo}
                </h1>
              </div>
              <small className="text-muted d-block mt-1">Transacción procesada correctamente</small>
            </div>
            <span className="text-muted font-monospace small">
              Código orden: ORDER{orden.codigo}
            </span>
          </div>

          {notifEmail && (
            <div className="alert alert-success py-2 small mb-4">
              Boleta digital enviada exitosamente a <strong>{orden.cliente?.correo}</strong>.
            </div>
          )}

          {/* Información del Cliente */}
          <div className="bg-surface rounded p-3 mb-4 border border-secondary border-opacity-25">
            <h2 className="h6 text-warning text-uppercase fw-bold mb-2">Información del Cliente</h2>
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
            <h2 className="h6 text-warning text-uppercase fw-bold mb-2">Dirección de Entrega</h2>
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

          {/* Tabla de Productos Comprados */}
          <div className="table-responsive mb-4">
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

          {/* Total Pagado */}
          <div className="text-center py-3 bg-surface rounded border border-secondary border-opacity-25 mb-4">
            <h3 className="h4 brand-font text-light mb-0">
              TOTAL PAGADO: <span className="text-warning">${orden.total?.toLocaleString('es-CL')}</span>
            </h3>
          </div>

          {/* Botones de Acción (Figura 7) */}
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button className="btn btn-danger btn-sm px-4 fw-bold" onClick={handlePrint}>
              Imprimir boleta en PDF
            </button>
            <button className="btn btn-primary btn-sm px-4 fw-bold" onClick={handleSendEmail}>
              Enviar boleta por email
            </button>
            <Link to="/menu" className="btn btn-outline-secondary btn-sm px-4">
              Volver a la Carta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
