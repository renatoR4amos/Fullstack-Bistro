// src/pages/Registro.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductos, crearReserva, getReservas, eliminarReserva } from '../services/dataService';

export default function Registro() {
  const { currentUser, login, register, logout } = useAuth();
  const navigate = useNavigate();

  const [tabActiva, setTabActiva] = useState('login'); // 'login', 'registro', 'reserva', 'misReservas'

  // Formulario Login
  const [loginRut, setLoginRut] = useState('');
  const [loginClave, setLoginClave] = useState('');
  const [loginError, setLoginError] = useState('');

  // Formulario Registro
  const [regData, setRegData] = useState({
    rut: '',
    nombre: '',
    correo: '',
    clave: '',
    telefono: '',
    direccion: '',
    comuna: 'Cerrillos'
  });
  const [regError, setRegError] = useState('');
  const [regExito, setRegExito] = useState(false);

  // Formulario Reserva
  const [productos, setProductos] = useState([]);
  const [reservaForm, setReservaForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    personas: 2,
    fecha: '',
    hora: '20:00'
  });
  const [preorden, setPreorden] = useState({});
  const [codigoGenerado, setCodigoGenerado] = useState(null);

  // Consulta de Reservas
  const [busqCodigo, setBusqCodigo] = useState('');
  const [reservaEncontrada, setReservaEncontrada] = useState(null);
  const [busqMensaje, setBusqMensaje] = useState('');

  useEffect(() => {
    setProductos(getProductos());
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = login(loginRut.trim(), loginClave);
    if (res.success) {
      if (res.user.rol === 'Administrador' || res.user.rol === 'Staff') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegSubmit = (e) => {
    e.preventDefault();
    setRegError('');
    if (!regData.rut || !regData.nombre || !regData.correo || !regData.clave) {
      setRegError('Por favor completa todos los campos obligatorios (*).');
      return;
    }
    const res = register(regData);
    if (res.success) {
      setRegExito(true);
      setTimeout(() => navigate('/menu'), 1500);
    } else {
      setRegError(res.message);
    }
  };

  const handleReservaSubmit = (e) => {
    e.preventDefault();
    const itemsPreorden = Object.entries(preorden)
      .filter(([_, cant]) => cant > 0)
      .map(([id, cant]) => {
        const prod = productos.find(p => p.id === Number(id));
        return {
          id: Number(id),
          nombre: prod?.nombre || '',
          precio: prod?.precio || 0,
          cantidad: cant
        };
      });

    const totalPreorden = itemsPreorden.reduce((s, it) => s + (it.precio * it.cantidad), 0);

    const nueva = crearReserva({
      nombre: reservaForm.nombre || currentUser?.nombre || 'Cliente Bistró',
      correo: reservaForm.correo || currentUser?.correo || '',
      telefono: reservaForm.telefono || currentUser?.telefono || '',
      personas: reservaForm.personas,
      fecha: reservaForm.fecha,
      hora: reservaForm.hora,
      preorden: itemsPreorden,
      totalPreorden
    });

    setCodigoGenerado(nueva.codigo);
  };

  const handleBuscarReserva = (e) => {
    e.preventDefault();
    setBusqMensaje('');
    setReservaEncontrada(null);
    const todas = getReservas();
    const encontrada = todas.find(r => r.codigo.toUpperCase() === busqCodigo.trim().toUpperCase());
    if (encontrada) {
      setReservaEncontrada(encontrada);
    } else {
      setBusqMensaje('No se encontró ninguna reserva asociada al código ingresado.');
    }
  };

  const handleCancelarReserva = (id) => {
    if (window.confirm('¿Confirmas la cancelación definitiva de esta reserva?')) {
      eliminarReserva(id);
      setReservaEncontrada(null);
      setBusqMensaje('La reserva ha sido cancelada exitosamente.');
    }
  };

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: '840px' }}>
        <header className="text-center mb-4">
          <h1 className="h2 brand-font text-light mb-1">ACCESO, REGISTRO & RESERVAS</h1>
          <p className="text-muted small">
            Gestiona tu cuenta de usuario o agenda tu mesa en Restaurante Bistro.
          </p>
        </header>

        {/* Selector de Pestañas */}
        <ul className="nav nav-pills justify-content-center mb-4 gap-2 flex-wrap">
          <li className="nav-item">
            <button
              className={`btn btn-sm ${tabActiva === 'login' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              onClick={() => setTabActiva('login')}
            >
              1. Iniciar Sesión
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`btn btn-sm ${tabActiva === 'registro' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              onClick={() => setTabActiva('registro')}
            >
              2. Crear Cuenta
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`btn btn-sm ${tabActiva === 'reserva' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              onClick={() => setTabActiva('reserva')}
            >
              3. Agendar Mesa
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`btn btn-sm ${tabActiva === 'misReservas' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              onClick={() => setTabActiva('misReservas')}
            >
              4. Consultar Mesa
            </button>
          </li>
        </ul>

        {/* 1. Iniciar Sesión */}
        {tabActiva === 'login' && (
          <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm mx-auto" style={{ maxWidth: '480px' }}>
            <h2 className="h4 brand-font text-warning mb-2 text-center">AUTENTICACIÓN DE USUARIO</h2>
            <p className="text-muted small text-center mb-4">Ingresa con tu RUT o Correo Electrónico</p>

            {currentUser ? (
              <div className="text-center py-3">
                <div className="alert alert-success py-2 small mb-3">
                  Sesión iniciada como <strong>{currentUser.nombre}</strong> ({currentUser.rol}).
                </div>
                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                    Cerrar Sesión
                  </button>
                  <button className="btn btn-neon btn-sm" onClick={() => navigate('/menu')}>
                    Ir a la Carta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit}>
                {loginError && <div className="alert alert-danger py-2 small mb-3">{loginError}</div>}

                <div className="mb-3">
                  <label className="form-label text-light small fw-semibold">RUT o Correo *</label>
                  <input
                    type="text"
                    className="form-control bg-surface text-light border-secondary"
                    placeholder="22.007.178-2 o correo"
                    value={loginRut}
                    onChange={(e) => setLoginRut(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-light small fw-semibold">Contraseña *</label>
                  <input
                    type="password"
                    className="form-control bg-surface text-light border-secondary"
                    placeholder="Clave de acceso"
                    value={loginClave}
                    onChange={(e) => setLoginClave(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-neon w-100 py-2 fw-bold mb-3">
                  Entrar al Sistema
                </button>

                <div className="p-3 bg-surface rounded border border-secondary border-opacity-25 small text-muted">
                  <strong className="text-warning d-block mb-1">Cuentas Demostrativas:</strong>
                  • Admin: <code>22.007.178-2</code> / <code>admin123</code><br />
                  • Staff: <code>11.111.111-1</code> / <code>bistro14</code><br />
                  • Cliente: <code>18.456.789-0</code> / <code>cliente123</code>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 2. Crear Cuenta */}
        {tabActiva === 'registro' && (
          <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm mx-auto" style={{ maxWidth: '580px' }}>
            <h2 className="h4 brand-font text-warning mb-2 text-center">CREAR CUENTA CLIENTE</h2>
            <p className="text-muted small text-center mb-4">Regístrate para agilizar tus pedidos y entregas</p>

            {regExito ? (
              <div className="alert alert-success text-center py-3">
                ¡Cuenta registrada con éxito! Redirigiendo a la carta...
              </div>
            ) : (
              <form onSubmit={handleRegSubmit}>
                {regError && <div className="alert alert-danger py-2 small mb-3">{regError}</div>}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-light small fw-semibold">RUT *</label>
                    <input
                      type="text"
                      className="form-control bg-surface text-light border-secondary"
                      placeholder="12.345.678-9"
                      value={regData.rut}
                      onChange={(e) => setRegData({ ...regData, rut: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-light small fw-semibold">Nombre Completo *</label>
                    <input
                      type="text"
                      className="form-control bg-surface text-light border-secondary"
                      placeholder="Ej. Juan Pérez"
                      value={regData.nombre}
                      onChange={(e) => setRegData({ ...regData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-light small fw-semibold">Correo Electrónico *</label>
                    <input
                      type="email"
                      className="form-control bg-surface text-light border-secondary"
                      placeholder="juan@correo.com"
                      value={regData.correo}
                      onChange={(e) => setRegData({ ...regData, correo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-light small fw-semibold">Contraseña *</label>
                    <input
                      type="password"
                      className="form-control bg-surface text-light border-secondary"
                      placeholder="Mínimo 6 caracteres"
                      value={regData.clave}
                      onChange={(e) => setRegData({ ...regData, clave: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-light small fw-semibold">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control bg-surface text-light border-secondary"
                      placeholder="+56 9 1234 5678"
                      value={regData.telefono}
                      onChange={(e) => setRegData({ ...regData, telefono: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-light small fw-semibold">Comuna</label>
                    <select
                      className="form-select bg-surface text-light border-secondary"
                      value={regData.comuna}
                      onChange={(e) => setRegData({ ...regData, comuna: e.target.value })}
                    >
                      <option value="Cerrillos">Cerrillos</option>
                      <option value="Las Condes">Las Condes</option>
                      <option value="Providencia">Providencia</option>
                      <option value="Santiago Centro">Santiago Centro</option>
                      <option value="Ñuñoa">Ñuñoa</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-light small fw-semibold">Dirección de Despacho Habitual</label>
                    <input
                      type="text"
                      className="form-control bg-surface text-light border-secondary"
                      placeholder="Calle, número, departamento"
                      value={regData.direccion}
                      onChange={(e) => setRegData({ ...regData, direccion: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-neon w-100 py-2 fw-bold mt-4">
                  Registrar Cuenta
                </button>
              </form>
            )}
          </div>
        )}

        {/* 3. Agendar Mesa */}
        {tabActiva === 'reserva' && (
          <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm">
            <h2 className="h4 brand-font text-warning mb-2 text-center">AGENDAR MESA EN BISTRO</h2>
            <p className="text-muted small text-center mb-4">Asegura tu visita y añade platos a tu pre-orden opcional</p>

            {codigoGenerado ? (
              <div className="text-center py-4 bg-surface rounded border border-success p-4">
                <span className="badge bg-success fs-6 mb-2">¡Reserva Confirmada!</span>
                <h3 className="h5 text-light mb-1">Código de Reserva:</h3>
                <div className="display-6 font-monospace text-warning fw-bold my-2">{codigoGenerado}</div>
                <p className="text-muted small mb-4">
                  Presenta este código al llegar al restaurante. También puedes consultarlo en la pestaña "Consultar Mesa".
                </p>
                <button className="btn btn-outline-warning btn-sm" onClick={() => setCodigoGenerado(null)}>
                  Hacer Otra Reserva
                </button>
              </div>
            ) : (
              <form onSubmit={handleReservaSubmit}>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label text-light small fw-semibold">Nombre Responsable *</label>
                    <input
                      type="text"
                      className="form-control bg-surface text-light border-secondary"
                      value={reservaForm.nombre}
                      onChange={(e) => setReservaForm({ ...reservaForm, nombre: e.target.value })}
                      placeholder="Ej. Renato Ramos"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-light small fw-semibold">Correo Electrónico *</label>
                    <input
                      type="email"
                      className="form-control bg-surface text-light border-secondary"
                      value={reservaForm.correo}
                      onChange={(e) => setReservaForm({ ...reservaForm, correo: e.target.value })}
                      placeholder="contacto@correo.com"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-light small fw-semibold">Teléfono *</label>
                    <input
                      type="tel"
                      className="form-control bg-surface text-light border-secondary"
                      value={reservaForm.telefono}
                      onChange={(e) => setReservaForm({ ...reservaForm, telefono: e.target.value })}
                      placeholder="+56 9 ..."
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-light small fw-semibold">Cantidad de Personas *</label>
                    <select
                      className="form-select bg-surface text-light border-secondary"
                      value={reservaForm.personas}
                      onChange={(e) => setReservaForm({ ...reservaForm, personas: Number(e.target.value) })}
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-light small fw-semibold">Fecha de Visita *</label>
                    <input
                      type="date"
                      className="form-control bg-surface text-light border-secondary"
                      value={reservaForm.fecha}
                      onChange={(e) => setReservaForm({ ...reservaForm, fecha: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-light small fw-semibold">Horario *</label>
                    <select
                      className="form-select bg-surface text-light border-secondary"
                      value={reservaForm.hora}
                      onChange={(e) => setReservaForm({ ...reservaForm, hora: e.target.value })}
                    >
                      <option value="13:00">13:00 hrs (Almuerzo)</option>
                      <option value="14:30">14:30 hrs (Almuerzo)</option>
                      <option value="20:00">20:00 hrs (Cena)</option>
                      <option value="21:30">21:30 hrs (Cena)</option>
                      <option value="22:30">22:30 hrs (Cena)</option>
                    </select>
                  </div>
                </div>

                {/* Pre-orden Opcional */}
                <h3 className="h6 text-warning text-uppercase fw-bold mb-2">Pre-orden de la carta (Opcional)</h3>
                <div className="table-responsive bg-surface rounded border border-secondary border-opacity-25 p-2 mb-4" style={{ maxHeight: '240px' }}>
                  <table className="table table-dark table-sm align-middle mb-0">
                    <tbody>
                      {productos.slice(0, 6).map(p => (
                        <tr key={p.id}>
                          <td><strong>{p.nombre}</strong></td>
                          <td className="text-warning small">${p.precio.toLocaleString('es-CL')}</td>
                          <td style={{ width: '120px' }} className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-secondary py-0"
                                onClick={() => setPreorden({ ...preorden, [p.id]: Math.max(0, (preorden[p.id] || 0) - 1) })}
                              >
                                -
                              </button>
                              <span className="btn btn-outline-secondary py-0 disabled text-light px-2">
                                {preorden[p.id] || 0}
                              </span>
                              <button
                                type="button"
                                className="btn btn-outline-secondary py-0"
                                onClick={() => setPreorden({ ...preorden, [p.id]: (preorden[p.id] || 0) + 1 })}
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button type="submit" className="btn btn-neon w-100 py-3 fw-bold">
                  Confirmar Reserva de Mesa
                </button>
              </form>
            )}
          </div>
        )}

        {/* 4. Consultar / Cancelar Reserva */}
        {tabActiva === 'misReservas' && (
          <div className="card bg-card border-secondary border-opacity-25 p-4 shadow-sm mx-auto" style={{ maxWidth: '580px' }}>
            <h2 className="h4 brand-font text-warning mb-2 text-center">CONSULTAR RESERVA EXISTENTE</h2>
            <p className="text-muted small text-center mb-4">Ingresa tu código único de reserva (ej. RES-ABCDE)</p>

            <form onSubmit={handleBuscarReserva} className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-surface text-light border-secondary font-monospace text-uppercase"
                  placeholder="RES-12345"
                  value={busqCodigo}
                  onChange={(e) => setBusqCodigo(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-neon">Buscar</button>
              </div>
            </form>

            {busqMensaje && (
              <div className="alert alert-info py-2 small text-center mb-3">{busqMensaje}</div>
            )}

            {reservaEncontrada && (
              <div className="bg-surface rounded p-4 border border-warning border-opacity-50">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-warning text-dark font-monospace fw-bold">{reservaEncontrada.codigo}</span>
                  <span className="badge bg-success">Activa</span>
                </div>
                <p className="mb-1 text-light"><strong>Titular:</strong> {reservaEncontrada.nombre}</p>
                <p className="mb-1 text-muted small"><strong>Fecha:</strong> {reservaEncontrada.fecha} a las {reservaEncontrada.hora} hrs ({reservaEncontrada.personas} personas)</p>
                <p className="mb-3 text-muted small"><strong>Contacto:</strong> {reservaEncontrada.correo} | Tel: {reservaEncontrada.telefono}</p>

                {reservaEncontrada.preorden && reservaEncontrada.preorden.length > 0 && (
                  <div className="p-2 bg-dark rounded border border-secondary border-opacity-25 mb-3 small">
                    <strong className="text-warning d-block mb-1">Pre-orden solicitada:</strong>
                    {reservaEncontrada.preorden.map((it, idx) => (
                      <span key={idx} className="d-block text-muted">{it.cantidad}x {it.nombre}</span>
                    ))}
                  </div>
                )}

                <button
                  className="btn btn-outline-danger btn-sm w-100"
                  onClick={() => handleCancelarReserva(reservaEncontrada.id)}
                >
                  Cancelar Esta Reserva
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
