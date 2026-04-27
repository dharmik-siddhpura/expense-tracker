const CURRENCIES = { INR: { symbol: '₹', locale: 'en-IN' }, USD: { symbol: '$', locale: 'en-US' }, EUR: { symbol: '€', locale: 'de-DE' }, GBP: { symbol: '£', locale: 'en-GB' } };

export const formatCurrency = (amount, currency = 'INR') => {
  const c = CURRENCIES[currency] || CURRENCIES.INR;
  return new Intl.NumberFormat(c.locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const getCategoryIcon = (cat) => {
  const icons = { Salary:'💼', Freelance:'💻', Food:'🍔', Transport:'🚗', Entertainment:'🎬',
                  Shopping:'🛍️', Health:'🏥', Bills:'📄', Education:'📚', Other:'📦' };
  return icons[cat] || '📦';
};

export const showToast = (message, type = 'info') => {
  let container = document.getElementById('toast-container');
  if (!container) { container = document.createElement('div'); container.id = 'toast-container'; document.body.appendChild(container); }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch { return null; }
};

export const getUserCurrency = () => localStorage.getItem('currency') || 'INR';
