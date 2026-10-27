// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { getSesionActual, loginUsuario, cerrarSesion, crearUsuario } from '../services/dataService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getSesionActual());

  const login = (rut, clave) => {
    const user = loginUsuario(rut, clave);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'RUT o contraseña incorrectos' };
  };

  const logout = () => {
    cerrarSesion();
    setCurrentUser(null);
  };

  const register = (userData) => {
    try {
      const nuevo = crearUsuario(userData);
      login(nuevo.rut, nuevo.clave);
      return { success: true, user: nuevo };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.rol === 'Administrador' || currentUser?.rol === 'Staff'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
