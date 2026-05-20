import { configureStore } from '@reduxjs/toolkit';
import carritoReducer from './carritoSlice';
import authReducer from './authSlice';

function loadCarrito() {
  try {
    const data = localStorage.getItem('carrito');
    return data ? { carrito: JSON.parse(data) } : undefined;
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    carrito: carritoReducer,
    auth: authReducer,
  },
  preloadedState: loadCarrito(),
});

store.subscribe(() => {
  try {
    localStorage.setItem('carrito', JSON.stringify(store.getState().carrito));
  } catch {}
});
