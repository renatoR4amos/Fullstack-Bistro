// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  resetProductos,
  getCategorias,
  crearCategoria,
  eliminarCategoria,
  getOrdenes,
  getUsuarios,
  crearUsuario,
  eliminarUsuario,
  getReservas,
  eliminarReserva
} from '../services/dataService';

export default function Admin() {
  const { currentUser, login, logout, isAdmin } = useAuth();

  // Autenticación si no es admin
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Sub-vista activa: 'dashboard', 'productos', 'criticos', 'categorias', 'ordenes', 'usuarios', 'reservas'
  const [seccion, setSeccion] = useState('dashboard');

  // Datos locales
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);

  // Modales y formularios
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    precio: '',
    precioOferta: '',
    enOferta: false,
    categoria: 'Barcos & Mixtas',
    desc: '',
    stock: 15,
    stockCritico: 5,
    imagen: '/img/hero-ceviche.jpg'
  });
  const [editandoId, setEditandoId] = useState(null);
  const [nuevaCatNombre, setNuevaCatNombre] = useState('');
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  const cargarDatos = () => {
    setProductos(getProductos());
    setCategorias(getCategorias());
    setOrdenes(getOrdenes());
    setUsuarios(getUsuarios());
    setReservas(getReservas());
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleLoginAdmin = (e) => {
    e.preventDefault();
    setPinError('');
    const res = login(pinInput.trim(), pinInput.trim() === 'bistro14' ? 'bistro14' : 'admin123');
    if (!res.success) {
      if (pinInput.trim() === 'bistro14') {
        login('11.111.111-1', 'bistro14');
      } else if (pinInput.trim() === 'admin123') {
        login('22.007.178-2', 'admin123');
      } else {
        setPinError('Credencial de acceso inválida.');
      }
    }
  };

  // CRUD Productos
  const handleGuardarProducto = (e) => {
    e.preventDefault();
    if (!formProducto.nombre || !formProducto.precio) {
      alert('Nombre y precio son obligatorios.');
      return;
    }

    if (editandoId) {
      actualizarProducto(editandoId, formProducto);
      setEditandoId(null);
    } else {
      crearProducto(formProducto);
    }

    setFormProducto({
      nombre: '',
      precio: '',
      precioOferta: '',
      enOferta: false,
      categoria: categorias[0] || 'Barcos & Mixtas',
      desc: '',
      stock: 15,
      stockCritico: 5,
      imagen: '/img/hero-ceviche.jpg'
    });
    cargarDatos();
    alert('Producto guardado correctamente en la base de datos simulada.');
  };

  const handleEditarProducto = (p) => {
    setEditandoId(p.id);
    setFormProducto({
      nombre: p.nombre,
      precio: p.precio,
      precioOferta: p.precioOferta || '',
      enOferta: p.enOferta,
      categoria: p.categoria,
      desc: p.desc,
      stock: p.stock,
      stockCritico: p.stockCritico,
      imagen: p.imagen
    });
    setSeccion('productos');
  };

  const handleEliminarProducto = (id) => {
    if (window.confirm('¿Eliminar este plato de la carta?')) {
      eliminarProducto(id);
      cargarDatos();
    }
  };

  const handleResetearCatalogo = () => {
    if (window.confirm('¿Restablecer el catálogo completo a los 13 productos iniciales?')) {
      resetProductos();
      cargarDatos();
    }
  };

  // CRUD Categorías
  const handleCrearCategoria = (e) => {
    e.preventDefault();
    if (nuevaCatNombre.trim()) {
      crearCategoria(nuevaCatNombre.trim());
      setNuevaCatNombre('');
      cargarDatos();
    }
  };

  const handleEliminarCategoria = (cat) => {
    if (window.confirm(`¿Eliminar la categoría "${cat}"?`)) {
      eliminarCategoria(cat);
      cargarDatos();
    }
  };

  // Si no está autenticado como admin/staff
  if (!isAdmin) {
    return (
      <div className="container py-5 text-center">
        <div className="card bg-card border-secondary p-5 mx-auto shadow-lg" style={{ maxWidth: '440px' }}>
          <h1 className="h3 brand-font text-warning mb-2">ACCESO STAFF & ADMINISTRADOR</h1>
          <p className="text-muted small mb-4">
            Ingresa tu clave de autorización administrativa para gestionar el sistema.
          </p>

          <form onSubmit={handleLoginAdmin}>
            {pinError && <div className="alert alert-danger py-2 small mb-3">{pinError}</div>}
            <div className="mb-3 text-start">
              <label className="form-label text-light small fw-semibold">Contraseña o Clave Staff *</label>
              <input
                type="password"
                className="form-control bg-surface text-light border-secondary"
                placeholder="Ej. admin123 o bistro14"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-neon w-100 py-2 fw-bold">
              Ingresar al Panel
            </button>
            <small className="text-muted d-block mt-3">
              Claves de demostración: <strong className="text-warning">admin123</strong> (Administrador) o <strong className="text-warning">bistro14</strong> (Staff)
            </small>
          </form>
        </div>
      </div>
    );
  }

  // Métricas calculadas para Dashboard (Figura 9)
  const totalVentas = ordenes.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalProductos = productos.length;
  const totalUsuarios = usuarios.length;
  const productosCriticos = productos.filter(p => p.stock <= p.stockCritico);

  return (
    <div className="py-5">
      <div className="container-fluid px-lg-5">
        {/* Cabecera del Panel */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25 flex-wrap gap-2">
          <div>
            <span className="badge bg-warning text-dark text-uppercase fw-bold px-2 py-1 mb-1">
              Panel Administrativo
            </span>
            <h1 className="h2 brand-font text-light mb-0">SISTEMA DE GESTIÓN BISTRO</h1>
            <small className="text-muted">
              Sesión activa: <strong className="text-light">{currentUser.nombre}</strong> ({currentUser.rol})
            </small>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={handleResetearCatalogo}>
              Restablecer Carta Base
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* 1. Tarjetas de Resumen / Métricas (Figura 9 de la pauta) */}
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="card bg-card border-secondary border-opacity-25 p-3 shadow-sm h-100">
              <span className="text-muted small text-uppercase fw-semibold">Compras / Ventas</span>
              <div className="fs-3 fw-bold text-primary mt-1">${totalVentas.toLocaleString('es-CL')}</div>
              <small className="text-muted">{ordenes.length} órdenes registradas</small>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card bg-card border-secondary border-opacity-25 p-3 shadow-sm h-100">
              <span className="text-muted small text-uppercase fw-semibold">Productos Carta</span>
              <div className="fs-3 fw-bold text-success mt-1">{totalProductos}</div>
              <small className="text-muted">{categorias.length} categorías activas</small>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card bg-card border-secondary border-opacity-25 p-3 shadow-sm h-100">
              <span className="text-muted small text-uppercase fw-semibold">Usuarios Registrados</span>
              <div className="fs-3 fw-bold text-warning mt-1">{totalUsuarios}</div>
              <small className="text-muted">Clientes y personal staff</small>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card bg-card border-danger border-opacity-50 p-3 shadow-sm h-100">
              <span className="text-danger small text-uppercase fw-bold">Stock Crítico</span>
              <div className="fs-3 fw-bold text-danger mt-1">{productosCriticos.length}</div>
              <small className="text-muted">Productos bajo umbral mínimo</small>
            </div>
          </div>
        </div>

        {/* 2. Barra de Navegación del Administrador (Figura 9 & 10) */}
        <div className="d-flex flex-wrap gap-2 mb-4 p-2 bg-surface rounded border border-secondary border-opacity-25">
          <button
            className={`btn btn-sm ${seccion === 'dashboard' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setSeccion('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`btn btn-sm ${seccion === 'productos' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setSeccion('productos')}
          >
            Gestión Productos ({productos.length})
          </button>
          <button
            className={`btn btn-sm ${seccion === 'criticos' ? 'btn-danger text-light fw-bold' : 'btn-outline-danger'}`}
            onClick={() => setSeccion('criticos')}
          >
            Stock Crítico ({productosCriticos.length})
          </button>
          <button
            className={`btn btn-sm ${seccion === 'categorias' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setSeccion('categorias')}
          >
            Categorías ({categorias.length})
          </button>
          <button
            className={`btn btn-sm ${seccion === 'ordenes' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setSeccion('ordenes')}
          >
            Órdenes & Boletas ({ordenes.length})
          </button>
          <button
            className={`btn btn-sm ${seccion === 'usuarios' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setSeccion('usuarios')}
          >
            Usuarios ({usuarios.length})
          </button>
          <button
            className={`btn btn-sm ${seccion === 'reservas' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setSeccion('reservas')}
          >
            Reservas de Mesas ({reservas.length})
          </button>
        </div>

        {/* SECCIÓN 1: DASHBOARD RESUMEN */}
        {seccion === 'dashboard' && (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm">
                <h3 className="h5 brand-font text-warning mb-3">ÚLTIMAS ÓRDENES RECIBIDAS</h3>
                <div className="table-responsive">
                  <table className="table table-dark table-hover table-sm align-middle mb-0">
                    <thead className="table-secondary small text-uppercase">
                      <tr>
                        <th>N° Orden</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th className="text-center">Boleta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenes.slice(0, 5).map((o, idx) => (
                        <tr key={idx}>
                          <td><span className="badge bg-secondary font-monospace">#{o.codigo}</span></td>
                          <td><strong>{o.cliente?.nombre} {o.cliente?.apellidos}</strong></td>
                          <td className="text-muted small">{o.fecha}</td>
                          <td className="text-warning fw-bold">${o.total?.toLocaleString('es-CL')}</td>
                          <td>
                            <span className={`badge ${o.estado === 'Aprobado' ? 'bg-success' : 'bg-danger'}`}>
                              {o.estado}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-outline-info btn-sm py-0 px-2"
                              onClick={() => setOrdenSeleccionada(o)}
                            >
                              Ver Boleta
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Directorio de Clientes que hicieron Reservas */}
              <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h3 className="h5 brand-font text-warning mb-0">CLIENTES POR RESERVAS (CONTACTO GMAIL)</h3>
                    <small className="text-muted">Registro de usuarios para contacto directo del dueño/administrador</small>
                  </div>
                  <span className="badge bg-warning text-dark font-monospace">{reservas.length} registrados</span>
                </div>

                <div className="table-responsive">
                  <table className="table table-dark table-hover table-sm align-middle mb-0">
                    <thead className="table-secondary small text-uppercase">
                      <tr>
                        <th>Nombre Cliente</th>
                        <th>Correo Gmail</th>
                        <th>Teléfono</th>
                        <th>Reserva</th>
                        <th className="text-center">Acción Directa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-3">
                            No hay clientes con reservas registradas aún.
                          </td>
                        </tr>
                      ) : (
                        reservas.map(r => (
                          <tr key={r.id}>
                            <td>
                              <strong className="text-light">{r.nombre}</strong>
                            </td>
                            <td>
                              <span className="text-info font-monospace small">{r.correo}</span>
                            </td>
                            <td className="small text-muted">{r.telefono || 'N/A'}</td>
                            <td className="small">
                              <span className="badge bg-secondary me-1 font-monospace">{r.codigo}</span>
                              {r.fecha} ({r.personas} pers.)
                            </td>
                            <td className="text-center">
                              <a
                                href={`mailto:${r.correo}?subject=Contacto%20Restaurante%20Bistro%20-%20Reserva%20${r.codigo}`}
                                className="btn btn-outline-warning btn-sm py-0 px-2 fw-semibold"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Escribir a Gmail
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm mb-4">
                <h3 className="h6 brand-font text-warning mb-3">PRODUCTOS EN RIESGO DE STOCK</h3>
                {productosCriticos.length === 0 ? (
                  <p className="text-success small mb-0">Todos los productos cuentan con stock adecuado.</p>
                ) : (
                  <ul className="list-group list-group-flush bg-transparent">
                    {productosCriticos.map(p => (
                      <li key={p.id} className="list-group-item bg-transparent text-light d-flex justify-content-between align-items-center px-0 py-2 border-secondary border-opacity-25">
                        <span className="small">{p.nombre}</span>
                        <span className="badge bg-danger">{p.stock} unid.</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm">
                <h3 className="h6 brand-font text-warning mb-2">ACCIONES RÁPIDAS</h3>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-light btn-sm text-start" onClick={() => setSeccion('productos')}>
                    + Registrar nuevo plato a la carta
                  </button>
                  <button className="btn btn-outline-light btn-sm text-start" onClick={() => setSeccion('categorias')}>
                    + Crear nueva categoría de menú
                  </button>
                  <button className="btn btn-outline-light btn-sm text-start" onClick={() => setSeccion('ordenes')}>
                    Ver historial completo de boletas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: GESTIÓN DE PRODUCTOS (CRUD) */}
        {seccion === 'productos' && (
          <div className="row g-4">
            {/* Formulario Crear / Editar */}
            <div className="col-lg-4">
              <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm">
                <h3 className="h5 brand-font text-warning mb-3">
                  {editandoId ? `EDITAR PRODUCTO #${editandoId}` : 'AGREGAR NUEVO PRODUCTO'}
                </h3>

                <form onSubmit={handleGuardarProducto}>
                  <div className="mb-2">
                    <label className="form-label text-light small fw-semibold">Nombre del Plato *</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-surface text-light border-secondary"
                      value={formProducto.nombre}
                      onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label text-light small fw-semibold">Precio Normal *</label>
                      <input
                        type="number"
                        className="form-control form-control-sm bg-surface text-light border-secondary"
                        value={formProducto.precio}
                        onChange={(e) => setFormProducto({ ...formProducto, precio: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-light small fw-semibold">Precio Oferta</label>
                      <input
                        type="number"
                        className="form-control form-control-sm bg-surface text-light border-secondary"
                        value={formProducto.precioOferta}
                        onChange={(e) => setFormProducto({ ...formProducto, precioOferta: e.target.value })}
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkOferta"
                      checked={formProducto.enOferta}
                      onChange={(e) => setFormProducto({ ...formProducto, enOferta: e.target.checked })}
                    />
                    <label className="form-check-label text-muted small" htmlFor="checkOferta">
                      Marcar en sección Ofertas
                    </label>
                  </div>

                  <div className="mb-2">
                    <label className="form-label text-light small fw-semibold">Categoría *</label>
                    <select
                      className="form-select form-select-sm bg-surface text-light border-secondary"
                      value={formProducto.categoria}
                      onChange={(e) => setFormProducto({ ...formProducto, categoria: e.target.value })}
                    >
                      {categorias.map((c, idx) => (
                        <option key={idx} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label text-light small fw-semibold">Stock Actual</label>
                      <input
                        type="number"
                        className="form-control form-control-sm bg-surface text-light border-secondary"
                        value={formProducto.stock}
                        onChange={(e) => setFormProducto({ ...formProducto, stock: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-light small fw-semibold">Stock Crítico</label>
                      <input
                        type="number"
                        className="form-control form-control-sm bg-surface text-light border-secondary"
                        value={formProducto.stockCritico}
                        onChange={(e) => setFormProducto({ ...formProducto, stockCritico: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label text-light small fw-semibold">Ruta de Imagen</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-surface text-light border-secondary"
                      value={formProducto.imagen}
                      onChange={(e) => setFormProducto({ ...formProducto, imagen: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small fw-semibold">Descripción Detallada</label>
                    <textarea
                      rows="2"
                      className="form-control form-control-sm bg-surface text-light border-secondary"
                      value={formProducto.desc}
                      onChange={(e) => setFormProducto({ ...formProducto, desc: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="d-flex gap-2">
                    {editandoId && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm flex-grow-1"
                        onClick={() => {
                          setEditandoId(null);
                          setFormProducto({
                            nombre: '',
                            precio: '',
                            precioOferta: '',
                            enOferta: false,
                            categoria: categorias[0],
                            desc: '',
                            stock: 15,
                            stockCritico: 5,
                            imagen: '/img/hero-ceviche.jpg'
                          });
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                    <button type="submit" className="btn btn-neon btn-sm flex-grow-1 fw-bold">
                      {editandoId ? 'Actualizar Plato' : 'Guardar en Carta'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Tabla Listado de Productos */}
            <div className="col-lg-8">
              <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 brand-font text-light mb-0">CARTA DE PRODUCTOS ({productos.length})</h3>
                  <small className="text-muted">Operaciones CRUD sincronizadas con localStorage</small>
                </div>

                <div className="table-responsive">
                  <table className="table table-dark table-hover table-sm align-middle mb-0">
                    <thead className="table-secondary small text-uppercase">
                      <tr>
                        <th style={{ width: '50px' }}>Img</th>
                        <th>Nombre y Descripción</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th className="text-center">Stock</th>
                        <th className="text-center" style={{ width: '110px' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map(p => (
                        <tr key={p.id}>
                          <td>
                            <img
                              src={p.imagen}
                              alt=""
                              style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '3px' }}
                            />
                          </td>
                          <td>
                            <strong>{p.nombre}</strong>
                            {p.enOferta && <span className="badge bg-danger ms-2">Oferta</span>}
                            <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '280px' }}>
                              {p.desc}
                            </p>
                          </td>
                          <td className="small text-warning">{p.categoria}</td>
                          <td className="text-nowrap small">
                            {p.enOferta && p.precioOferta ? (
                              <>
                                <span className="text-decoration-line-through text-muted small me-1">
                                  ${p.precio.toLocaleString('es-CL')}
                                </span>
                                <strong className="text-warning">
                                  ${p.precioOferta.toLocaleString('es-CL')}
                                </strong>
                              </>
                            ) : (
                              <strong>${p.precio.toLocaleString('es-CL')}</strong>
                            )}
                          </td>
                          <td className="text-center">
                            <span className={`badge ${p.stock <= p.stockCritico ? 'bg-danger' : 'bg-secondary'}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-warning py-0 px-2"
                                onClick={() => handleEditarProducto(p)}
                                title="Editar"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-outline-danger py-0 px-2"
                                onClick={() => handleEliminarProducto(p.id)}
                                title="Eliminar"
                              >
                                &times;
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: PRODUCTOS CRÍTICOS (Figura 10 de la pauta) */}
        {seccion === 'criticos' && (
          <div className="card bg-card border-danger border-opacity-50 p-4 shadow-sm">
            <h3 className="h5 brand-font text-danger mb-2">LISTADO DE PRODUCTOS CON STOCK CRÍTICO</h3>
            <p className="text-muted small mb-4">
              Platos con unidades iguales o inferiores al umbral de reposición.
            </p>

            {productosCriticos.length === 0 ? (
              <div className="alert alert-success py-3 text-center">
                Excelente: Ningún producto tiene nivel de stock crítico actualmente.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="table-secondary small text-uppercase">
                    <tr>
                      <th style={{ width: '60px' }}>Imagen</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th className="text-center">Stock Actual</th>
                      <th className="text-center">Stock Mínimo</th>
                      <th className="text-center">Acción Inmediata</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosCriticos.map(p => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.imagen}
                            alt=""
                            style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </td>
                        <td><strong>{p.nombre}</strong></td>
                        <td className="text-warning">{p.categoria}</td>
                        <td className="text-center">
                          <span className="badge bg-danger fs-6">{p.stock} unidades</span>
                        </td>
                        <td className="text-center text-muted">{p.stockCritico} unidades</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => {
                              actualizarProducto(p.id, { stock: p.stock + 20 });
                              cargarDatos();
                            }}
                          >
                            + Reponer 20 unidades
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN 4: GESTIÓN DE CATEGORÍAS */}
        {seccion === 'categorias' && (
          <div className="row g-4">
            <div className="col-md-5">
              <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm">
                <h3 className="h5 brand-font text-warning mb-3">NUEVA CATEGORÍA</h3>
                <form onSubmit={handleCrearCategoria}>
                  <div className="mb-3">
                    <label className="form-label text-light small fw-semibold">Nombre de la Categoría *</label>
                    <input
                      type="text"
                      className="form-control bg-surface text-light border-secondary"
                      placeholder="Ej. Postres & Cafetería"
                      value={nuevaCatNombre}
                      onChange={(e) => setNuevaCatNombre(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-neon w-100 fw-bold">
                    Crear Categoría
                  </button>
                </form>
              </div>
            </div>

            <div className="col-md-7">
              <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm">
                <h3 className="h5 brand-font text-light mb-3">CATEGORÍAS REGISTRADAS</h3>
                <ul className="list-group list-group-flush bg-transparent">
                  {categorias.map((cat, idx) => {
                    const cant = productos.filter(p => p.categoria === cat).length;
                    return (
                      <li key={idx} className="list-group-item bg-transparent text-light d-flex justify-content-between align-items-center py-3 border-secondary border-opacity-25">
                        <div>
                          <strong className="fs-6">{cat}</strong>
                          <small className="text-muted d-block">{cant} platos asociados</small>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleEliminarCategoria(cat)}
                          disabled={cant > 0}
                          title={cant > 0 ? 'No se puede eliminar porque contiene platos' : 'Eliminar categoría'}
                        >
                          Eliminar
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 5: ÓRDENES Y BOLETAS (Figura 10 de la pauta) */}
        {seccion === 'ordenes' && (
          <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm">
            <h3 className="h5 brand-font text-warning mb-3">HISTORIAL DE ÓRDENES Y BOLETAS</h3>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead className="table-secondary small text-uppercase">
                  <tr>
                    <th>N° Orden</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Dirección Despacho</th>
                    <th>Ítems</th>
                    <th className="text-end">Total</th>
                    <th>Estado</th>
                    <th className="text-center">Boleta</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map((o, idx) => (
                    <tr key={idx}>
                      <td><span className="badge bg-secondary font-monospace">#{o.codigo}</span></td>
                      <td className="small text-muted">{o.fecha}</td>
                      <td>
                        <strong>{o.cliente?.nombre} {o.cliente?.apellidos}</strong>
                        <br />
                        <small className="text-muted">{o.cliente?.correo}</small>
                      </td>
                      <td className="small text-muted">
                        {o.direccion?.calle}, {o.direccion?.comuna}
                      </td>
                      <td className="small">
                        {o.items?.map((it, i) => (
                          <span key={i} className="d-block">{it.cantidad}x {it.nombre}</span>
                        ))}
                      </td>
                      <td className="text-end text-warning fw-bold fs-6">
                        ${o.total?.toLocaleString('es-CL')}
                      </td>
                      <td>
                        <span className={`badge ${o.estado === 'Aprobado' ? 'bg-success' : 'bg-danger'}`}>
                          {o.estado}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => setOrdenSeleccionada(o)}
                        >
                          Ver Boleta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN 6: USUARIOS REGISTRADOS */}
        {seccion === 'usuarios' && (
          <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm">
            <h3 className="h5 brand-font text-warning mb-3">LISTADO DE USUARIOS REGISTRADOS</h3>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead className="table-secondary small text-uppercase">
                  <tr>
                    <th>RUT</th>
                    <th>Nombre Completo</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Teléfono</th>
                    <th className="text-center">Compras</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u, idx) => (
                    <tr key={idx}>
                      <td className="font-monospace small">{u.rut}</td>
                      <td><strong>{u.nombre}</strong></td>
                      <td className="small text-muted">{u.correo}</td>
                      <td>
                        <span className={`badge ${u.rol === 'Administrador' ? 'bg-danger' : u.rol === 'Staff' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="small text-muted">{u.telefono || 'N/A'}</td>
                      <td className="text-center fw-bold text-warning">{u.comprasRealizadas || 0}</td>
                      <td className="text-center">
                        {u.rut !== currentUser.rut && (
                          <button
                            className="btn btn-outline-danger btn-sm py-0 px-2"
                            onClick={() => {
                              if (window.confirm(`¿Eliminar al usuario ${u.nombre}?`)) {
                                eliminarUsuario(u.rut);
                                cargarDatos();
                              }
                            }}
                          >
                            &times;
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN 7: RESERVAS DE MESAS */}
        {seccion === 'reservas' && (
          <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm">
            <h3 className="h5 brand-font text-warning mb-3">RESERVAS DE MESAS REGISTRADAS</h3>
            {reservas.length === 0 ? (
              <p className="text-muted small mb-0">No hay reservas de mesas activas.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="table-secondary small text-uppercase">
                    <tr>
                      <th>Código</th>
                      <th>Titular</th>
                      <th>Contacto</th>
                      <th>Fecha y Hora</th>
                      <th>Personas</th>
                      <th>Pre-orden</th>
                      <th className="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map(r => (
                      <tr key={r.id}>
                        <td><span className="badge bg-warning text-dark font-monospace">{r.codigo}</span></td>
                        <td><strong>{r.nombre}</strong></td>
                        <td className="small text-muted">
                          <a
                            href={`mailto:${r.correo}?subject=BISTRO%20Restaurante%20-%20Reserva%20${r.codigo}`}
                            className="text-info text-decoration-none fw-semibold d-block"
                            title="Escribir por Gmail"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {r.correo}
                          </a>
                          <small>Tel: {r.telefono || 'N/A'}</small>
                        </td>
                        <td className="small"><strong>{r.fecha}</strong> a las {r.hora} hrs</td>
                        <td className="text-center fw-bold">{r.personas}</td>
                        <td className="small">
                          {r.preorden && r.preorden.length > 0 ? (
                            r.preorden.map((p, i) => (
                              <span key={i} className="d-block text-warning">{p.cantidad}x {p.nombre}</span>
                            ))
                          ) : (
                            <span className="text-muted">Sin pre-orden</span>
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-danger btn-sm py-0 px-2"
                            onClick={() => {
                              if (window.confirm('¿Eliminar esta reserva?')) {
                                eliminarReserva(r.id);
                                cargarDatos();
                              }
                            }}
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODAL DE BOLETA (Figura 10 de la pauta) */}
        {ordenSeleccionada && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content bg-card text-light border-secondary">
                <div className="modal-header border-secondary border-opacity-25">
                  <h4 className="modal-title brand-font text-warning">
                    BOLETA ELECTRÓNICA NRO #{ordenSeleccionada.codigo}
                  </h4>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setOrdenSeleccionada(null)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3 small mb-3">
                    <div className="col-6">
                      <strong>Cliente:</strong> {ordenSeleccionada.cliente?.nombre} {ordenSeleccionada.cliente?.apellidos}<br />
                      <strong>Correo:</strong> {ordenSeleccionada.cliente?.correo}
                    </div>
                    <div className="col-6 text-end">
                      <strong>Fecha:</strong> {ordenSeleccionada.fecha}<br />
                      <strong>Estado:</strong> <span className="badge bg-success">{ordenSeleccionada.estado}</span>
                    </div>
                    <div className="col-12 border-top border-secondary border-opacity-25 pt-2">
                      <strong>Dirección de Entrega:</strong> {ordenSeleccionada.direccion?.calle}, {ordenSeleccionada.direccion?.departamento || ''}, {ordenSeleccionada.direccion?.comuna}, {ordenSeleccionada.direccion?.region}
                    </div>
                  </div>

                  <table className="table table-dark table-sm mb-3">
                    <thead className="table-secondary small">
                      <tr>
                        <th>Producto</th>
                        <th className="text-end">Precio</th>
                        <th className="text-center">Cant.</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenSeleccionada.items?.map((it, idx) => (
                        <tr key={idx}>
                          <td>{it.nombre}</td>
                          <td className="text-end">${it.precio?.toLocaleString('es-CL')}</td>
                          <td className="text-center">{it.cantidad}</td>
                          <td className="text-end text-warning">${it.subtotal?.toLocaleString('es-CL')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end fw-bold text-uppercase pt-2">Total Pagado:</td>
                        <td className="text-end fw-bold text-warning fs-5 pt-2">
                          ${ordenSeleccionada.total?.toLocaleString('es-CL')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setOrdenSeleccionada(null)}>
                    Cerrar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => window.print()}>
                    Imprimir Boleta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
