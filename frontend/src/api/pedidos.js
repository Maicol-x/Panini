import axiosClient from './axiosClient';

export const getPedidos = async () => {
  const { data } = await axiosClient.get('/pedidos');
  return data;
};

export const getStats = async () => {
  const { data } = await axiosClient.get('/pedidos/stats');
  return data;
};
