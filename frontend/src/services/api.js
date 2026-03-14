import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Session management
const getSessionId = () => {
  let sid = localStorage.getItem('fk_session_id');
  if (!sid) {
    sid = 'fk_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    localStorage.setItem('fk_session_id', sid);
  }
  return sid;
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach session id
api.interceptors.request.use((config) => {
  config.headers['x-session-id'] = getSessionId();
  return config;
});

// ─── Products ────────────────────────────────────────────────────────────────
export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
};

// ─── Categories ──────────────────────────────────────────────────────────────
export const categoryService = {
  getAll: () => api.get('/categories'),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartService = {
  getCart: () => api.get('/cart'),
  getCount: () => api.get('/cart/count'),
  addItem: (product_id, quantity = 1) => api.post('/cart/add', { product_id, quantity }),
  updateItem: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  removeItem: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart/clear'),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderService = {
  placeOrder: (data) => api.post('/orders/place', data),
  getOrders: () => api.get('/orders'),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
};


export default api;
