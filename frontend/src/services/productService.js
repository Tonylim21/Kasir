import api from './api';

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};
export const addProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, updatedData) => {

  const response = await api.post(`/product/${id}`, updatedData);
  return response.data;
};
export const deleteProduct = async (id) => {
  const response = await api.delete(`/product/${id}`);
  return response.data;
};