import api from './api';

export const createTransaction = async (transactionData) => {
  const response = await api.post('/sales', transactionData);
  return response.data;
};

export const getTransactionHistory = async () => {
  const response = await api.get('/transactions');
  return response.data;
};