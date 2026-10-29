// src/services/dataService.js
// Servicio de datos simulado y persistencia en localStorage para Restaurante Bistro

import { supabase, isSupabaseConfigured } from './supabaseClient';

export const PLATOS_INICIALES = [
  {
    id: 1,
    nombre: "Promo 50 Piezas Mixtas",
    precio: 16990,
    precioOferta: 14990,
    enOferta: true,
    categoria: "Barcos & Mixtas",
    imagen: "/img/hero-promo50.jpg",
    desc: "50 piezas: 10 Rolls camarón queso cebollín panko, 10 hosomaki pollo teriyaki queso panko, 10 rolls salmón palta en sésamo, 10 rolls queso crema ciboulette y 10 crispy furai.",
    stock: 25,
    stockCritico: 5
  },
  {
    id: 2,
    nombre: "Barco Acevichado Premium",
    precio: 18990,
    precioOferta: 16990,
    enOferta: true,
    categoria: "Barcos & Mixtas",
    imagen: "/img/hero-barco-acevichado.jpg",
    desc: "40 piezas: 10 rolls acevichados en ají amarillo, 10 rolls tempura camarón, 10 rolls salmón palta, 10 niguiris salmón flambeado al soplete y salsa unagi.",
    stock: 18,
    stockCritico: 4
  },
  {
    id: 3,
    nombre: "Moly Signature Burger",
    precio: 9990,
    precioOferta: null,
    enOferta: false,
    categoria: "Burger & Grill",
    imagen: "/img/moly_burger_signature.jpg",
    desc: "Doble burger de vacuno 180g smash, doble cheddar americano, tocino crujiente, cebolla caramelizada y salsa tártara de la casa en pan brioche artesanal.",
    stock: 30,
    stockCritico: 6
  },
  {
    id: 4,
    nombre: "Ceviche Mixto Tradicional",
    precio: 7990,
    precioOferta: 6990,
    enOferta: true,
    categoria: "Entradas",
    imagen: "/img/hero-ceviche.jpg",
    desc: "Reineta fresca en cubos, camarones ecuatorianos y calamares marinados en leche de tigre al cilantro, con choclo peruano, camote glaseado y cebolla morada.",
    stock: 15,
    stockCritico: 3
  },
  {
    id: 5,
    nombre: "Ebi Furay Crispy",
    precio: 6500,
    precioOferta: null,
    enOferta: false,
    categoria: "Entradas",
    imagen: "/img/hero-ebi.jpg",
    desc: "6 camarones ecuatorianos calibre XL apanados en panko japonés, fritos al momento, acompañados de salsa agridulce teriyaki y dip de maracuyá.",
    stock: 20,
    stockCritico: 5
  },
  {
    id: 6,
    nombre: "Handroll Pollo Tempura",
    precio: 4500,
    precioOferta: null,
    enOferta: false,
    categoria: "Entradas",
    imagen: "/img/hero-handroll.jpg",
    desc: "Cono crocante apanado en panko relleno de filete de pollo tempura, abundante queso crema y cebollín fresco, bañado con salsa unagi.",
    stock: 3, // stock crítico a modo demostrativo
    stockCritico: 5
  },
  {
    id: 7,
    nombre: "Gohan Salmon Palta",
    precio: 8500,
    precioOferta: 7500,
    enOferta: true,
    categoria: "Bowls & Gohan",
    imagen: "/img/hero-gohan.jpg",
    desc: "Bowl con base de arroz sushi sazonado, 120g de salmón fresco en cubos, palta hass en abanico, queso crema philadelphia, cebollín y sésamo tostado.",
    stock: 22,
    stockCritico: 4
  },
  {
    id: 8,
    nombre: "Bacon Cheese Burger",
    precio: 8990,
    precioOferta: null,
    enOferta: false,
    categoria: "Burger & Grill",
    imagen: "/img/moly_burger_bacon.jpg",
    desc: "Carne angus 180g a la parrilla, triple lámina de queso cheddar derretido, tiras de tocino crocante y salsa barbecue artesanal en pan brioche con mantequilla.",
    stock: 14,
    stockCritico: 4
  },
  {
    id: 9,
    nombre: "Salchipapas Supremas",
    precio: 6990,
    precioOferta: null,
    enOferta: false,
    categoria: "Acompanamientos",
    imagen: "/img/sagrado_bajon_salchipapas.jpg",
    desc: "Porción abundante de papas fritas rústicas crocantes, salchichas ahumadas grilladas, queso cheddar fundido y lluvia de ciboulette fresco.",
    stock: 2, // stock crítico
    stockCritico: 5
  },
  {
    id: 10,
    nombre: "Torta Imperial 100 Piezas",
    precio: 25990,
    precioOferta: 22990,
    enOferta: true,
    categoria: "Barcos & Mixtas",
    imagen: "/img/hero-torta100.jpg",
    desc: "100 piezas premium: 20 hot rolls en panko, 20 rolls en palta, 20 rolls en salmón, 20 hosomakis mixtos y 20 bocados crispy especiales con 4 salsas.",
    stock: 10,
    stockCritico: 2
  },
  {
    id: 11,
    nombre: "Limonada Menta Jengibre",
    precio: 3500,
    precioOferta: null,
    enOferta: false,
    categoria: "Bebidas",
    imagen: "/img/bebida_limonada.jpg",
    desc: "Limonada frappé 500cc elaborada con limones naturales exprimidos al momento, hojas de menta maceradas, jengibre fresco y hielo granizado.",
    stock: 40,
    stockCritico: 10
  },
  {
    id: 12,
    nombre: "Cerveza Artesanal Schop",
    precio: 4500,
    precioOferta: null,
    enOferta: false,
    categoria: "Bebidas",
    imagen: "/img/bebida_cerveza.jpg",
    desc: "Schop 500cc de cerveza artesanal nacional estilo American Pale Ale (APA), notas cítricas, amargor balanceado y espuma cremosa servida bien fría.",
    stock: 25,
    stockCritico: 8
  },
  {
    id: 13,
    nombre: "Bebida en Lata 350cc",
    precio: 2000,
    precioOferta: null,
    enOferta: false,
    categoria: "Bebidas",
    imagen: "/img/bebida_lata.jpg",
    desc: "Lata individual de 350cc servida con vaso de hielo y rodaja de limón. Variedad a elección: Coca-Cola original, Sin Azúcar, Sprite o Fanta.",
    stock: 50,
    stockCritico: 15
  }
];

export const CATEGORIAS_INICIALES = [
  "Barcos & Mixtas",
  "Burger & Grill",
  "Entradas",
  "Bowls & Gohan",
  "Acompanamientos",
  "Bebidas"
];

export const USUARIOS_INICIALES = [
  {
    rut: "22.007.178-2",
    nombre: "Renato Ramos",
    correo: "renato.ramos@duocuc.cl",
    clave: "admin123",
    rol: "Administrador",
    telefono: "+56 9 8765 4321",
    comprasRealizadas: 5
  },
  {
    rut: "11.111.111-1",
    nombre: "Staff Bistro",
    correo: "staff@bistro.cl",
    clave: "bistro14",
    rol: "Staff",
    telefono: "+56 9 1111 2222",
    comprasRealizadas: 0
  },
  {
    rut: "18.456.789-0",
    nombre: "Pedro Hacker",
    correo: "pedro.hacker20@example.com",
    clave: "cliente123",
    rol: "Cliente",
    telefono: "+56 9 9988 7766",
    direccion: "Los Crisantemos, Edificio Norte",
    departamento: "Depto 603",
    region: "Región Metropolitana de Santiago",
    comuna: "Cerrillos",
    indicaciones: "El martes no estaremos en el depto, pero puede dejárselo con el conserje.",
    comprasRealizadas: 3
  }
];

export const ORDENES_INICIALES = [
  {
    codigo: "20240705",
    fecha: "2024-10-25 14:32",
    cliente: {
      nombre: "Pedro",
      apellidos: "Hacker",
      correo: "pedro.hacker20@example.com"
    },
    direccion: {
      calle: "Los Crisantemos, Edificio Norte",
      departamento: "Depto 603",
      region: "Región Metropolitana de Santiago",
      comuna: "Cerrillos",
      indicaciones: "El martes no estaremos en el depto, pero puede dejárselo con el conserje."
    },
    items: [
      { id: 1, nombre: "Promo 50 Piezas Mixtas", precio: 14990, cantidad: 1, subtotal: 14990 },
      { id: 11, nombre: "Limonada Menta Jengibre", precio: 3500, cantidad: 2, subtotal: 7000 },
      { id: 9, nombre: "Salchipapas Supremas", precio: 6990, cantidad: 1, subtotal: 6990 }
    ],
    total: 28980,
    estado: "Aprobado"
  }
];

const KEYS = {
  PRODUCTOS: "bistro_productos_v2",
  CATEGORIAS: "bistro_categorias_v2",
  USUARIOS: "bistro_usuarios_v2",
  ORDENES: "bistro_ordenes_v2",
  RESERVAS: "bistro_reservas_v2",
  CARRITO: "bistro_carrito_v2",
  SESION: "bistro_sesion_v2"
};

function readStorage(key, defaultValue) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error("Error reading localStorage", e);
    return defaultValue;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing localStorage", e);
  }
}

export function initStorage() {
  if (!localStorage.getItem(KEYS.PRODUCTOS)) {
    writeStorage(KEYS.PRODUCTOS, PLATOS_INICIALES);
  }
  if (!localStorage.getItem(KEYS.CATEGORIAS)) {
    writeStorage(KEYS.CATEGORIAS, CATEGORIAS_INICIALES);
  }
  if (!localStorage.getItem(KEYS.USUARIOS)) {
    writeStorage(KEYS.USUARIOS, USUARIOS_INICIALES);
  }
  if (!localStorage.getItem(KEYS.ORDENES)) {
    writeStorage(KEYS.ORDENES, ORDENES_INICIALES);
  }
  if (!localStorage.getItem(KEYS.RESERVAS)) {
    writeStorage(KEYS.RESERVAS, []);
  }
  if (!localStorage.getItem(KEYS.CARRITO)) {
    writeStorage(KEYS.CARRITO, []);
  }
}

// ----------------- CRUD PRODUCTOS -----------------
export function getProductos() {
  initStorage();
  return readStorage(KEYS.PRODUCTOS, PLATOS_INICIALES);
}

export function getProductoById(id) {
  const productos = getProductos();
  return productos.find(p => p.id === Number(id));
}

export function crearProducto(nuevo) {
  const productos = getProductos();
  const id = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
  const item = {
    ...nuevo,
    id,
    precio: Number(nuevo.precio),
    stock: Number(nuevo.stock || 10),
    stockCritico: Number(nuevo.stockCritico || 3),
    enOferta: Boolean(nuevo.enOferta),
    precioOferta: nuevo.precioOferta ? Number(nuevo.precioOferta) : null,
    imagen: nuevo.imagen || "/img/hero-ceviche.jpg"
  };
  productos.push(item);
  writeStorage(KEYS.PRODUCTOS, productos);
  return item;
}

export function actualizarProducto(id, datos) {
  let productos = getProductos();
  productos = productos.map(p => {
    if (p.id === Number(id)) {
      return {
        ...p,
        ...datos,
        precio: Number(datos.precio ?? p.precio),
        stock: Number(datos.stock ?? p.stock),
        stockCritico: Number(datos.stockCritico ?? p.stockCritico),
        enOferta: Boolean(datos.enOferta ?? p.enOferta),
        precioOferta: datos.precioOferta ? Number(datos.precioOferta) : null
      };
    }
    return p;
  });
  writeStorage(KEYS.PRODUCTOS, productos);
  return productos.find(p => p.id === Number(id));
}

export function eliminarProducto(id) {
  let productos = getProductos();
  productos = productos.filter(p => p.id !== Number(id));
  writeStorage(KEYS.PRODUCTOS, productos);
  return productos;
}

export function resetProductos() {
  writeStorage(KEYS.PRODUCTOS, PLATOS_INICIALES);
  return PLATOS_INICIALES;
}

// ----------------- CRUD CATEGORIAS -----------------
export function getCategorias() {
  initStorage();
  return readStorage(KEYS.CATEGORIAS, CATEGORIAS_INICIALES);
}

export function crearCategoria(nombre) {
  const categorias = getCategorias();
  if (nombre && !categorias.includes(nombre)) {
    categorias.push(nombre);
    writeStorage(KEYS.CATEGORIAS, categorias);
  }
  return categorias;
}

export function eliminarCategoria(nombre) {
  let categorias = getCategorias();
  categorias = categorias.filter(c => c !== nombre);
  writeStorage(KEYS.CATEGORIAS, categorias);
  return categorias;
}

// ----------------- CRUD ORDENES -----------------
export function getOrdenes() {
  initStorage();
  return readStorage(KEYS.ORDENES, ORDENES_INICIALES);
}

export function getOrdenByCodigo(codigo) {
  const ordenes = getOrdenes();
  return ordenes.find(o => String(o.codigo) === String(codigo));
}

export function crearOrden(ordenData) {
  const ordenes = getOrdenes();
  const codigo = ordenData.codigo || String(Date.now()).slice(-8);
  const nuevaOrden = {
    ...ordenData,
    codigo,
    fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
    estado: ordenData.estado || "Aprobado"
  };
  ordenes.unshift(nuevaOrden);
  writeStorage(KEYS.ORDENES, ordenes);
  return nuevaOrden;
}

// ----------------- CRUD USUARIOS & SESION -----------------
export function getUsuarios() {
  initStorage();
  return readStorage(KEYS.USUARIOS, USUARIOS_INICIALES);
}

export function crearUsuario(nuevo) {
  const usuarios = getUsuarios();
  const existe = usuarios.some(u => u.rut === nuevo.rut);
  if (existe) {
    throw new Error("El RUT ingresado ya se encuentra registrado.");
  }
  const usuario = {
    ...nuevo,
    rol: nuevo.rol || "Cliente",
    comprasRealizadas: 0
  };
  usuarios.push(usuario);
  writeStorage(KEYS.USUARIOS, usuarios);
  return usuario;
}

export function actualizarUsuario(rut, datos) {
  let usuarios = getUsuarios();
  usuarios = usuarios.map(u => u.rut === rut ? { ...u, ...datos } : u);
  writeStorage(KEYS.USUARIOS, usuarios);
}

export function eliminarUsuario(rut) {
  let usuarios = getUsuarios();
  usuarios = usuarios.filter(u => u.rut !== rut);
  writeStorage(KEYS.USUARIOS, usuarios);
  return usuarios;
}

export function loginUsuario(rut, clave) {
  const usuarios = getUsuarios();
  const u = usuarios.find(user => (user.rut === rut || user.correo === rut) && user.clave === clave);
  if (u) {
    writeStorage(KEYS.SESION, u);
    return u;
  }
  return null;
}

export function getSesionActual() {
  return readStorage(KEYS.SESION, null);
}

export function cerrarSesion() {
  localStorage.removeItem(KEYS.SESION);
}

// ----------------- CRUD RESERVAS (LOCAL + SUPABASE) -----------------
export function getReservas() {
  initStorage();
  return readStorage(KEYS.RESERVAS, []);
}

export async function getReservasRemotas() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reservas_usuarios')
        .select('*')
        .order('id', { ascending: false });
      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('Fallo al obtener reservas desde Supabase:', e.message);
    }
  }
  return getReservas();
}

export async function crearReserva(reservaData) {
  const reservas = getReservas();
  const codigo = "RES-" + Math.random().toString(36).substring(2, 7).toUpperCase();
  const nueva = {
    id: Date.now(),
    codigo,
    ...reservaData
  };
  reservas.push(nueva);
  writeStorage(KEYS.RESERVAS, reservas);

  // Sincronización con Supabase si las credenciales están presentes
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('reservas_usuarios')
        .insert([{
          codigo: nueva.codigo,
          nombre: nueva.nombre,
          correo: nueva.correo,
          telefono: nueva.telefono || '',
          personas: Number(nueva.personas) || 2,
          fecha: nueva.fecha,
          hora: nueva.hora,
          preorden: nueva.preorden || [],
          total_preorden: Number(nueva.totalPreorden) || 0
        }]);
      if (error) {
        console.warn('Supabase error:', error.message);
      }
    } catch (err) {
      console.warn('Error de conexión a Supabase:', err.message);
    }
  }

  return nueva;
}

export async function eliminarReserva(id) {
  let reservas = getReservas();
  const target = reservas.find(r => r.id === Number(id));
  reservas = reservas.filter(r => r.id !== Number(id));
  writeStorage(KEYS.RESERVAS, reservas);

  if (isSupabaseConfigured && supabase && target) {
    try {
      await supabase
        .from('reservas_usuarios')
        .delete()
        .eq('codigo', target.codigo);
    } catch (e) {
      console.warn('Error eliminando de Supabase:', e.message);
    }
  }

  return reservas;
}
