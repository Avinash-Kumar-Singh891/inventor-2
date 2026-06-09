import axios from 'axios';

// Update this to match your FastAPI server URL and port
const API_URL = 'https://inventory-hsd0.onrender.com/'; 

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Calls
export const getDashboardSummary = () => api.get('/dashboard/summary');
export const getProducts = () => api.get('/products');
export const createProduct = (data) => api.post('/products', data);
export const getCustomers = () => api.get('/customers');
export const getOrders = () => api.get('/orders');
export const createOrder = (data) => api.post('/orders', data);