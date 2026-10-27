// src/components/CartModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartModal() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleIrCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-card text-light border-secondary shadow-lg">
          <div className="modal-header border-secondary border-opacity-25">
            <h4 className="modal-title brand-font text-warning d-flex align-items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              CARRITO DE COMPRAS ({totalItems} {totalItems === 1 ? 'ítem' : 'ítems'})
            </h4>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setIsCartOpen(false)}
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body p-4">
            {cart.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted fs-5 mb-3">Tu carrito se encuentra vacío actualmente.</p>
                <button
                  className="btn btn-neon btn-sm px-4"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/menu');
                  }}
                >
                  Explorar la Carta Digital
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="table-secondary text-uppercase small">
                    <tr>
                      <th scope="col" style={{ width: '60px' }}>Imagen</th>
                      <th scope="col">Nombre</th>
                      <th scope="col" className="text-end">Precio</th>
                      <th scope="col" className="text-center" style={{ width: '130px' }}>Cantidad</th>
                      <th scope="col" className="text-end">Subtotal</th>
                      <th scope="col" className="text-center" style={{ width: '60px' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </td>
                        <td>
                          <strong className="text-light">{item.nombre}</strong>
                          <br />
                          <small className="text-warning">{item.categoria}</small>
                        </td>
                        <td className="text-end text-muted small">
                          ${item.precio.toLocaleString('es-CL')}
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-secondary py-0 px-2"
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label="Disminuir"
                            >
                              -
                            </button>
                            <span className="btn btn-outline-secondary py-0 px-2 disabled text-light fw-bold">
                              {item.cantidad}
                            </span>
                            <button
                              className="btn btn-outline-secondary py-0 px-2"
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label="Aumentar"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-end text-warning fw-bold">
                          ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-danger btn-sm py-0 px-2"
                            onClick={() => removeFromCart(item.id)}
                            title="Eliminar plato"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="text-end text-uppercase fw-bold text-muted pt-3">
                        Total General a Pagar:
                      </td>
                      <td className="text-end text-warning fs-5 fw-bold pt-3">
                        ${totalPrice.toLocaleString('es-CL')}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="modal-footer border-secondary border-opacity-25 d-flex justify-content-between">
              <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
                Limpiar Carrito
              </button>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setIsCartOpen(false)}>
                  Seguir Comprando
                </button>
                <button className="btn btn-neon btn-sm px-4 fw-bold" onClick={handleIrCheckout}>
                  Comprar Ahora (${totalPrice.toLocaleString('es-CL')})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
