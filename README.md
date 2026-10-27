# BISTRO - Restaurante & Barra

Aplicación web desarrollada con **React 18**, **Vite** y **Bootstrap 5**.

---

## Características Principales
* **Single Page Application (SPA)**: Navegación rápida mediante `react-router-dom` sin recargas de página.
* **Persistencia en JavaScript**: Manejo de catálogo, reservas, órdenes y carrito almacenados en el navegador (`localStorage`).
* **Estado Global**: Gestión centralizada con React Context API (`CartContext` y `AuthContext`).
* **Diseño Responsivo**: Adaptado para dispositivos móviles, tablets y computadores de escritorio.
* **Módulos Disponibles**:
  * Inicio con especialidades y experiencia gastronómica.
  * Carta Digital con buscador interactivo y filtrado por categorías.
  * Carrito de compras con cálculo automático de totales.
  * Checkout y confirmación de pedidos.
  * Agendamiento y consulta de reservas de mesas.
  * Panel Staff para administración de platos, categorías y órdenes.

---

## Requisitos Previos
* Node.js (versión 18 o superior)
* npm (versión 9 o superior)

---

## Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/renatoR4amos/Fullstack-Bistro.git
   cd Fullstack-Bistro
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación se ejecutará en `http://localhost:5173`.

4. Generar la compilación para producción:
   ```bash
   npm run build
   ```
   Los archivos optimizados se generarán en la carpeta `dist/`.

---

## Despliegue en Netlify
El proyecto incluye el archivo `netlify.toml` preconfigurado:
* **Build Command**: `npm run build`
* **Publish Directory**: `dist`
* **SPA Redirects**: `/* -> /index.html` (código de estado 200)

Para desplegar:
1. Conectar este repositorio de GitHub en [Netlify](https://app.netlify.com/).
2. Netlify detectará la configuración automáticamente y publicará el sitio web.
