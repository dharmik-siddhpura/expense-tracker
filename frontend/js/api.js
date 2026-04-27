import { showToast } from './utils.js';

const BASE_URL = 'http://localhost:8080/api';

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  if (res.status === 401) {
    localStorage.clear();
    window.location.href = '/index.html';
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.message || 'Something went wrong';
    showToast(msg, 'error');
    throw new Error(msg);
  }

  return data;
};

export const api = {
  get:    (url)        => apiCall(url, 'GET'),
  post:   (url, body)  => apiCall(url, 'POST',   body),
  put:    (url, body)  => apiCall(url, 'PUT',     body),
  delete: (url)        => apiCall(url, 'DELETE'),
};
