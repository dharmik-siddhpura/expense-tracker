import { showToast } from './utils.js';

const BASE_URL = 'http://localhost:8080/api';

export const guardPage = () => {
  if (!localStorage.getItem('token')) {
    window.location.href = '/index.html';
  }
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/index.html';
};

export const initLogin = () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  if (localStorage.getItem('token')) { window.location.href = '/dashboard.html'; return; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Signing in...';
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.value, password: form.password.value })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('currency', data.data.user.currency || 'INR');
      localStorage.setItem('userName', data.data.user.name);
      window.location.href = '/dashboard.html';
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false; btn.textContent = 'Sign In';
    }
  });
};

export const initRegister = () => {
  const form = document.getElementById('register-form');
  if (!form) return;

  if (localStorage.getItem('token')) { window.location.href = '/dashboard.html'; return; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.password.value.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Creating account...';
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.value, email: form.email.value, password: form.password.value, currency: form.currency.value })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('currency', data.data.user.currency || 'INR');
      localStorage.setItem('userName', data.data.user.name);
      showToast('Account created! Welcome 🎉', 'success');
      window.location.href = '/dashboard.html';
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false; btn.textContent = 'Create Account';
    }
  });
};
