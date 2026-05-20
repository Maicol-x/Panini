import api from './axiosClient';

export const getProductos = (categoria_id) =>
  api.get('/productos', { params: categoria_id ? { categoria_id } : {} }).then((r) => r.data);

export const getProducto = (id) =>
  api.get(`/productos/${id}`).then((r) => r.data);

export const getCategorias = () =>
  api.get('/categorias').then((r) => r.data);
