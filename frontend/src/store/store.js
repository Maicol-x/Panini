import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import carritoReducer from './carritoSlice';
import authReducer from './authSlice';

const carritoPersistConfig = {
  key: 'carrito',
  storage,
};

const persistedCarrito = persistReducer(carritoPersistConfig, carritoReducer);

export const store = configureStore({
  reducer: {
    carrito: persistedCarrito,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
