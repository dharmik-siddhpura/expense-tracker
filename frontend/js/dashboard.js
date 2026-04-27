import { guardPage, logout } from './auth.js';
import { api } from './api.js';
import { formatCurrency, formatDate, getCategoryIcon, getUserCurrency, showToast } from './utils.js';

guardPage();

const currency = getUserCurrency();
let barChart = null, donutChart = null;

const el = (id) => document.getElementById(id);

const setUserInfo = () => {
  const name = localStorage.getItem('userName') || 'User';
  const initial = name.charAt(0).toUpperCase();
  el('user-name')?.innerHTML && (el('user-name').textContent = name);
  el('user-avatar')?.innerHTML && (el('user-avatar').textContent = initial);
  el('greeting').textContent = `Good day, ${name.split(' ')[0]} 👋`;
};

const renderSummary = async () => {
  try {
    const res = await api.get('/transactions/summary');
    const d   = res.data;
    el('stat-income').textContent  = formatCurrency(d.totalIncome,   currency);
    el('stat-expense').textContent = formatCurrency(d.totalExpense,  currency);
    el('stat-balance').textContent = formatCurrency(d.balance,       currency);
    el('stat-savings').textContent = `${d.savingsPercent}%`;
  } catch {}
};

const renderBarChart = async () => {
  try {
    const year = new Date().getFullYear();
    const res  = await api.get(`/reports/monthly?year=${year}`);
    const data = res.data.data;
    const ctx  = el('bar-chart').getContext('2d');
    if (barChart) barChart.destroy();
    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.month),
        datasets: [
          { label: 'Income',  data: data.map(d => d.income),  backgroundColor: '#22c55e', borderRadius: 5 },
          { label: 'Expense', data: data.map(d => d.expense), backgroundColor: '#ef4444', borderRadius: 5 },
        ]
      },
      options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
    });
  } catch {}
};

const renderDonut = async () => {
  try {
    const res  = await api.get('/transactions/by-category');
    const data = res.data;
    if (!data.length) { el('donut-chart').parentElement.innerHTML = '<div class="empty-state"><div class="icon">📊</div><p>No expense data yet</p></div>'; return; }
    const ctx = el('donut-chart').getContext('2d');
    if (donutChart) donutChart.destroy();
    const COLORS = ['#6366f1','#f59e0b','#22c55e','#ef4444','#3b82f6','#ec4899','#8b5cf6','#f97316'];
    donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.category),
        datasets: [{ data: data.map(d => d.total), backgroundColor: COLORS, borderWidth: 0 }]
      },
      options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'right' } } }
    });
  } catch {}
};

const renderRecent = async () => {
  try {
    const res  = await api.get('/transactions/recent');
    const list = res.data;
    const container = el('recent-list');
    if (!list.length) { container.innerHTML = '<div class="empty-state"><div class="icon">💸</div><p>No transactions yet</p></div>'; return; }
    container.innerHTML = list.map(t => `
      <div class="flex items-center justify-between" style="padding:.75rem;border-bottom:1px solid var(--border)">
        <div class="flex items-center gap-3">
          <span style="font-size:1.3rem">${getCategoryIcon(t.category)}</span>
          <div>
            <div style="font-weight:600;font-size:.875rem">${t.title}</div>
            <div style="font-size:.75rem;color:var(--text-muted)">${t.category} · ${formatDate(t.txnDate)}</div>
          </div>
        </div>
        <span class="${t.type === 'INCOME' ? 'text-success' : 'text-danger'}" style="font-weight:700;font-size:.9rem">
          ${t.type === 'INCOME' ? '+' : '-'}${formatCurrency(t.amount, currency)}
        </span>
      </div>`).join('');
  } catch {}
};

// Add transaction modal
const addBtn  = el('add-txn-btn');
const modal   = el('add-modal');
const closeBtn = el('modal-close');
const form    = el('add-txn-form');

addBtn?.addEventListener('click', () => modal.classList.remove('hidden'));
closeBtn?.addEventListener('click', () => modal.classList.add('hidden'));
modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  try {
    await api.post('/transactions', {
      title: fd.get('title'), amount: Number(fd.get('amount')),
      type: fd.get('type'), category: fd.get('category'),
      txnDate: fd.get('txnDate'), notes: fd.get('notes') || '',
    });
    showToast('Transaction added!', 'success');
    modal.classList.add('hidden');
    form.reset();
    await Promise.all([renderSummary(), renderBarChart(), renderDonut(), renderRecent()]);
  } catch {}
});

el('logout-btn')?.addEventListener('click', logout);

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? '' : 'dark';
  localStorage.setItem('theme', html.dataset.theme);
});

if (localStorage.getItem('theme') === 'dark') document.documentElement.dataset.theme = 'dark';

setUserInfo();
Promise.all([renderSummary(), renderBarChart(), renderDonut(), renderRecent()]);
