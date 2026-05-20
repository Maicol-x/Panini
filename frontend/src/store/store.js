import { configureStore } from '@reduxjs/toolkit';
import carritoReducer from './carritoSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    carrito: carritoReducer,
    auth: authReducer,
  },
});
