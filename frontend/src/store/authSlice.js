import { createSlice } from '@reduxjs/toolkit';

const tokenGuardado = localStorage.getItem('token');
const usuarioGuardado = localStorage.getItem('usuario');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: tokenGuardado || null,
    usuario: usuarioGuardado ? JSON.parse(usuarioGuardado) : null,
  },
  reducers: {
    setCredenciales(state, action) {
      const { token, usuario } = action.payload;
      state.token = token;
      state.usuario = usuario;
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
    },
    cerrarSesion(state) {
      state.token = null;
      state.usuario = null;
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    },
  },
});

export const { setCredenciales, cerrarSesion } = authSlice.actions;
export default authSlice.reducer;
