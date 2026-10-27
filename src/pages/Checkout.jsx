// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { crearOrden } from '../services/dataService';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Estados de información del cliente (autocompletables si hay sesión iniciada)
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Cerrillos',
    indicaciones: ''
  });

  const [simularError, setSimularError] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (currentUser) {
      const partes = (currentUser.nombre || '').split(' ');
      setFormData(prev => ({
        ...prev,
        nombre: partes[0] || '',
        apellidos: partes.slice(1).join(' ') || '',
        correo: currentUser.correo || '',
        calle: currentUser.direccion || prev.calle,
        departamento: currentUser.departamento || prev.departamento,
        region: currentUser.region || prev.region,
        comuna: currentUser.comuna || prev.comuna,
        indicaciones: currentUser.indicaciones || prev.indicaciones
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validar = () => {
    const errs = {};
    if (!formData.nombre.trim()) errs.nombre = 'El nombre es obligatorio.';
    if (!formData.apellidos.trim()) errs.apellidos = 'Los apellidos son obligatorios.';
    if (!formData.correo.trim() || !formData.correo.includes('@')) errs.correo = 'Ingrese un correo electrónico válido.';
    if (!formData.calle.trim()) errs.calle = 'La dirección de entrega es obligatoria.';
    if (!formData.comuna.trim()) errs.comuna = 'Seleccione o ingrese la comuna.';
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    if (cart.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de realizar el pago.');
      navigate('/menu');
      return;
    }

    const orderNumber = '20240705' || String(Math.floor(10000000 + Math.random() * 90000000));

    const nuevaOrden = {
      codigo: orderNumber,
      cliente: {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo
      },
      direccion: {
        calle: formData.calle,
        departamento: formData.departamento,
        region: formData.region,
        comuna: formData.comuna,
        indicaciones: formData.indicaciones
      },
      items: cart.map(i => ({
        id: i.id,
        nombre: i.nombre,
        precio: i.precio,
        cantidad: i.cantidad,
        subtotal: i.precio * i.cantidad,
        imagen: i.imagen
      })),
      total: totalPrice,
      estado: simularError ? 'Rechazado' : 'Aprobado'
    };

    crearOrden(nuevaOrden);

    if (simularError) {
      navigate(`/pago-error?codigo=${orderNumber}`);
    } else {
      clearCart();
      navigate(`/pago-exitoso?codigo=${orderNumber}`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card bg-card border-secondary p-5 mx-auto shadow" style={{ maxWidth: '540px' }}>
          <h2 className="brand-font text-warning mb-3">NO HAY PRODUCTOS PARA CHECKOUT</h2>
          <p className="text-muted small mb-4">
            Debes seleccionar al menos un plato o bebida de la carta digital para proceder al pago.
          </p>
          <button className="btn btn-neon w-100" onClick={() => navigate('/menu')}>
            Ir a la Carta Digital
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: '960px' }}>
        <header className="mb-4">
          <h1 className="h2 brand-font text-light mb-1">PROCESO DE PAGO & DESPACHO</h1>
          <p className="text-muted small">
            Verifica el detalle de tu compra e ingresa la dirección de entrega de tu pedido.
          </p>
        </header>

        {currentUser && (
          <div className="alert alert-warning py-2 small d-flex align-items-center mb-4">
            <span>Sesión activa como <strong>{currentUser.nombre}</strong>. Los datos fueron completados de manera automática.</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. Resumen Carrito de Compras (Figura 6 de la pauta) */}
          <div className="card bg-card border-secondary border-opacity-25 mb-4 shadow-sm">
            <div className="card-header border-secondary border-opacity-25 d-flex justify-content-between align-items-center py-3">
              <h2 className="h5 brand-font text-light mb-0">CARRITO DE COMPRA</h2>
              <span className="badge bg-primary fs-6 px-3 py-2 fw-bold">
                Total a pagar: ${totalPrice.toLocaleString('es-CL')}
              </span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead className="table-secondary small text-uppercase">
                    <tr>
                      <th style={{ width: '60px' }}>Imagen</th>
                      <th>Nombre</th>
                      <th className="text-end">Precio</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.imagen}
                            alt=""
                            style={{ width: '44px', height: '34px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </td>
                        <td>
                          <strong className="text-light">{item.nombre}</strong>
                        </td>
                        <td className="text-end text-muted small">
                          ${item.precio.toLocaleString('es-CL')}
                        </td>
                        <td className="text-center fw-bold">{item.cantidad}</td>
                        <td className="text-end text-warning fw-bold">
                          ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 2. Información del Cliente */}
          <div className="card bg-card border-secondary border-opacity-25 mb-4 shadow-sm p-4">
            <h2 className="h5 brand-font text-light mb-1">INFORMACIÓN DEL CLIENTE</h2>
            <p className="text-muted small mb-3">Completa la siguiente información personal</p>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-light small fw-semibold">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  className={`form-control bg-surface text-light border-secondary ${errores.nombre ? 'is-invalid' : ''}`}
                  placeholder="Ej. Pedro"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-semibold">Apellidos *</label>
                <input
                  type="text"
                  name="apellidos"
                  className={`form-control bg-surface text-light border-secondary ${errores.apellidos ? 'is-invalid' : ''}`}
                  placeholder="Ej. Hacker"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                />
                {errores.apellidos && <div className="invalid-feedback">{errores.apellidos}</div>}
              </div>

              <div className="col-12">
                <label className="form-label text-light small fw-semibold">Correo Electrónico *</label>
                <input
                  type="email"
                  name="correo"
                  className={`form-control bg-surface text-light border-secondary ${errores.correo ? 'is-invalid' : ''}`}
                  placeholder="pedro.hacker20@example.com"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
                {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
              </div>
            </div>
          </div>

          {/* 3. Dirección de Entrega de los Productos */}
          <div className="card bg-card border-secondary border-opacity-25 mb-4 shadow-sm p-4">
            <h2 className="h5 brand-font text-light mb-1">DIRECCIÓN DE ENTREGA DE LOS PRODUCTOS</h2>
            <p className="text-muted small mb-3">Ingrese dirección de forma detallada para el repartidor</p>

            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label text-light small fw-semibold">Calle y Número *</label>
                <input
                  type="text"
                  name="calle"
                  className={`form-control bg-surface text-light border-secondary ${errores.calle ? 'is-invalid' : ''}`}
                  placeholder="Ej. Los Crisantemos, Edificio Norte"
                  value={formData.calle}
                  onChange={handleChange}
                  required
                />
                {errores.calle && <div className="invalid-feedback">{errores.calle}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label text-light small fw-semibold">Departamento (opcional)</label>
                <input
                  type="text"
                  name="departamento"
                  className="form-control bg-surface text-light border-secondary"
                  placeholder="Ej. Depto 603"
                  value={formData.departamento}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-semibold">Región *</label>
                <select
                  name="region"
                  className="form-select bg-surface text-light border-secondary"
                  value={formData.region}
                  onChange={handleChange}
                >
                  <option value="Región Metropolitana de Santiago">Región Metropolitana de Santiago</option>
                  <option value="Valparaíso">Valparaíso</option>
                  <option value="Biobío">Biobío</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-semibold">Comuna *</label>
                <select
                  name="comuna"
                  className="form-select bg-surface text-light border-secondary"
                  value={formData.comuna}
                  onChange={handleChange}
                >
                  <option value="Cerrillos">Cerrillos</option>
                  <option value="Las Condes">Las Condes</option>
                  <option value="Providencia">Providencia</option>
                  <option value="Santiago Centro">Santiago Centro</option>
                  <option value="Ñuñoa">Ñuñoa</option>
                  <option value="Vitacura">Vitacura</option>
                  <option value="Maipú">Maipú</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label text-light small fw-semibold">Indicaciones para la entrega (opcional)</label>
                <textarea
                  name="indicaciones"
                  rows="2"
                  className="form-control bg-surface text-light border-secondary"
                  placeholder="Ej. El martes no estaremos en el depto, pero puede dejárselo con el conserje."
                  value={formData.indicaciones}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Opciones del Simulador y Botón Pagar */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 bg-surface rounded border border-secondary border-opacity-25 gap-3">
            <div className="form-check form-switch text-start">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="checkSimularError"
                checked={simularError}
                onChange={(e) => setSimularError(e.target.checked)}
              />
              <label className="form-check-label text-muted small" htmlFor="checkSimularError">
                Simulador docente: Forzar error en el pago (Demostración Vista Fallida)
              </label>
            </div>

            <button type="submit" className="btn btn-success btn-lg px-5 py-3 fw-bold shadow">
              Pagar ahora ${totalPrice.toLocaleString('es-CL')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
