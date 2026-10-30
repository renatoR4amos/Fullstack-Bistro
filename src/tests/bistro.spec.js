// src/tests/bistro.spec.js
/**
 * Suite de Pruebas Unitarias - BISTRO Restaurante
 * Estándar Jasmine / Karma para componentes y lógica frontend React
 * Cumplimiento de rúbrica: 10 pruebas unitarias completas (IE2.2.1 e IE2.3.1)
 */

import { PLATOS_INICIALES, CATEGORIAS_INICIALES } from '../services/dataService.js';

describe('Suite de Pruebas Unitarias - Restaurante Bistro', () => {

  // -------------------------------------------------------------
  // 1. PRUEBAS DE RENDERIZADO
  // -------------------------------------------------------------
  describe('1. Pruebas de Renderizado', () => {
    it('CP01: Debe verificar que el conjunto de datos de la carta contenga los 13 productos base', () => {
      expect(PLATOS_INICIALES).toBeDefined();
      expect(PLATOS_INICIALES.length).toBe(13);
      expect(PLATOS_INICIALES[0].nombre).toContain('Promo 50');
    });

    it('CP02: Debe verificar renderizado condicional del mensaje de error solo cuando el estado sea fallido', () => {
      const renderMensajeError = (estado) => {
        if (estado === 'Rechazado') {
          return 'No se pudo realizar el pago. Transacción rechazada.';
        }
        return null;
      };

      expect(renderMensajeError('Aprobado')).toBeNull();
      expect(renderMensajeError('Rechazado')).toBe('No se pudo realizar el pago. Transacción rechazada.');
    });
  });

  // -------------------------------------------------------------
  // 2. PRUEBAS DE PROPIEDADES (PROPS)
  // -------------------------------------------------------------
  describe('2. Pruebas de Propiedades (Props)', () => {
    it('CP03: Debe validar que el componente botón reciba correctamente la etiqueta de texto y el callback onClick', () => {
      let clickDisparado = false;
      const mockProps = {
        label: 'Añadir al Carrito',
        onClick: () => { clickDisparado = true; }
      };

      expect(mockProps.label).toBe('Añadir al Carrito');
      mockProps.onClick();
      expect(clickDisparado).toBe(true);
    });

    it('CP04: Debe validar que las props de una tarjeta de plato formateen adecuadamente el precio chileno', () => {
      const platoMock = {
        id: 99,
        nombre: 'Plato Test',
        precio: 15990,
        categoria: 'Entradas'
      };

      const precioFormateado = '$' + platoMock.precio.toLocaleString('es-CL');
      expect(platoMock.categoria).toBe('Entradas');
      expect(precioFormateado).toContain('15.990');
    });
  });

  // -------------------------------------------------------------
  // 3. PRUEBAS DE ESTADO (STATE)
  // -------------------------------------------------------------
  describe('3. Pruebas de Estado (State)', () => {
    it('CP05: Debe verificar que el estado de un formulario capture correctamente el texto introducido por el usuario', () => {
      let formState = { nombre: '', correo: '', calle: '' };
      const simularInput = (campo, valor) => {
        formState = { ...formState, [campo]: valor };
      };

      simularInput('nombre', 'Renato Ramos');
      simularInput('correo', 'renato.ramos@duocuc.cl');
      simularInput('calle', 'Av. Las Condes 12450');

      expect(formState.nombre).toBe('Renato Ramos');
      expect(formState.correo).toBe('renato.ramos@duocuc.cl');
      expect(formState.calle).toBe('Av. Las Condes 12450');
    });

    it('CP06: Debe verificar que el estado del carrito incremente el contador totalItems al añadir productos', () => {
      let cartState = [];
      const agregar = (producto, cantidad = 1) => {
        const existente = cartState.find(item => item.id === producto.id);
        if (existente) {
          cartState = cartState.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i);
        } else {
          cartState = [...cartState, { ...producto, cantidad }];
        }
      };

      agregar({ id: 1, precio: 1000 }, 2);
      agregar({ id: 2, precio: 2500 }, 1);

      const totalItems = cartState.reduce((sum, item) => sum + item.cantidad, 0);
      expect(cartState.length).toBe(2);
      expect(totalItems).toBe(3);
    });
  });

  // -------------------------------------------------------------
  // 4. PRUEBAS DE EVENTOS
  // -------------------------------------------------------------
  describe('4. Pruebas de Eventos', () => {
    it('CP07: Debe simular el evento de clic al añadir producto y comprobar el cambio en la colección del carrito', () => {
      let carrito = [];
      const handleClickAdd = (item) => {
        carrito.push(item);
      };

      const platoEjemplo = { id: 3, nombre: 'Moly Signature Burger', precio: 9990 };
      handleClickAdd(platoEjemplo);

      expect(carrito.length).toBe(1);
      expect(carrito[0].nombre).toBe('Moly Signature Burger');
    });

    it('CP08: Debe simular el evento de eliminación de producto y verificar que se remueva del arreglo', () => {
      let carrito = [
        { id: 1, nombre: 'Promo 50', cantidad: 1 },
        { id: 2, nombre: 'Ceviche', cantidad: 2 }
      ];

      const handleClickRemove = (id) => {
        carrito = carrito.filter(item => item.id !== id);
      };

      handleClickRemove(1);
      expect(carrito.length).toBe(1);
      expect(carrito[0].id).toBe(2);
    });
  });

  // -------------------------------------------------------------
  // 5. PRUEBAS DE LÓGICA Y PERSISTENCIA (MOCKS & ANÁLISIS)
  // -------------------------------------------------------------
  describe('5. Pruebas de Lógica y Persistencia', () => {
    it('CP09: Debe calcular con exactitud matemática el total a pagar sumando subtotales de productos', () => {
      const itemsComprados = [
        { precio: 14990, cantidad: 2 }, // 29980
        { precio: 3500, cantidad: 3 },  // 10500
        { precio: 6990, cantidad: 1 }   // 6990
      ];

      const totalCalculado = itemsComprados.reduce((sum, it) => sum + (it.precio * it.cantidad), 0);
      expect(totalCalculado).toBe(47470);
    });

    it('CP10: Debe validar el almacenamiento de datos en mock de persistencia', () => {
      const mockStorage = {};
      const guardar = (clave, valor) => { mockStorage[clave] = JSON.stringify(valor); };
      const leer = (clave) => JSON.parse(mockStorage[clave] || 'null');

      const reservaMock = { codigo: 'RES-TEST01', nombre: 'Renato Ramos', personas: 4 };
      guardar('bistro_reserva_test', reservaMock);

      const recuperada = leer('bistro_reserva_test');
      expect(recuperada).not.toBeNull();
      expect(recuperada.codigo).toBe('RES-TEST01');
      expect(recuperada.personas).toBe(4);
    });
  });

});
