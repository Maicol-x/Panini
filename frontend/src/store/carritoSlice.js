import { createSlice } from '@reduxjs/toolkit';

const carritoSlice = createSlice({
  name: 'carrito',
  initialState: { items: [] },
  reducers: {
    agregarItem(state, action) {
      const existe = state.items.find((i) => i.id === action.payload.id);
      if (existe) {
        existe.cantidad += 1;
      } else {
        state.items.push({ ...action.payload, cantidad: 1 });
      }
    },
    quitarItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    cambiarCantidad(state, action) {
      const { id, cantidad } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.cantidad = Math.max(1, cantidad);
      }
    },
    vaciarCarrito(state) {
      state.items = [];
    },
  },
});

export const { agregarItem, quitarItem, cambiarCantidad, vaciarCarrito } = carritoSlice.actions;
export default carritoSlice.reducer;
