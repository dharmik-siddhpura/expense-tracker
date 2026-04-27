import { guardPage, logout } from './auth.js';
import { api } from './api.js';
import { formatCurrency, getUserCurrency, showToast } from './utils.js';

guardPage();
const currency = getUserCurrency();

const el = (id) => document.getElementById(id);

const renderBudgets = async () => {
  try {
    const res     = await api.get('/budgets');
    const budgets = res.data;
    const grid    = el('budget-grid');
    if (!budgets.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon">🎯</div><p>No budgets set. Click "Set Budget" to start!</p></div>';
      return;
    }
    grid.innerHTML = budgets.map(b => {
      const pct   = Math.min(b.percentage, 100);
      const cls   = pct >= 100 ? 'progress-danger' : pct >= 80 ? 'progress-warning' : 'progress-safe';
      const alert = pct >= 100
        ? '<p style="font-size:.75rem;color:var(--danger);margin-top:.5rem;background:#fee2e2;padding:.4rem .75rem;border-radius:6px">🚨 Budget exceeded!</p>'
        : pct >= 80
        ? '<p style="font-size:.75rem;color:var(--warning);margin-top:.5rem;background:#fef3c7;padding:.4rem .75rem;border-radius:6px">⚠️ Approaching limit!</p>'
        : '';
      return `
        <div class="card">
          <div class="flex justify-between items-center mb-3">
            <h3 style="font-size:.95rem;font-weight:700">${b.category}</h3>
            <span style="font-size:.8rem;color:var(--text-muted)">${formatCurrency(b.spent, currency)} / ${formatCurrency(b.budgetLimit, currency)}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill ${cls}" style="width:${pct}%"></div></div>
          <div class="flex justify-between mt-2">
            <span style="font-size:.75rem;font-weight:600;color:${pct>=100?'var(--danger)':pct>=80?'var(--warning)':'var(--success)'}">${b.percentage}% used</span>
            <span style="font-size:.75rem;color:var(--text-muted)">${formatCurrency(Math.max(b.budgetLimit - b.spent, 0), currency)} left</span>
          </div>
          ${alert}
        </div>`;
    }).join('');
  } catch {}
};

el('add-btn')?.addEventListener('click', () => el('budget-modal').classList.remove('hidden'));
el('modal-close')?.addEventListener('click', () => el('budget-modal').classList.add('hidden'));
el('budget-modal')?.addEventListener('click', e => { if (e.target === el('budget-modal')) el('budget-modal').classList.add('hidden'); });

el('budget-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = el('budget-form');
  const now = new Date();
  try {
    await api.post('/budgets', {
      category: f.category.value, budgetLimit: Number(f.limit.value),
      month: now.getMonth() + 1, year: now.getFullYear(),
    });
    showToast('Budget set!', 'success');
    el('budget-modal').classList.add('hidden');
    f.reset();
    renderBudgets();
  } catch {}
});

el('logout-btn')?.addEventListener('click', logout);
if (localStorage.getItem('theme') === 'dark') document.documentElement.dataset.theme = 'dark';
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? '' : 'dark';
  localStorage.setItem('theme', html.dataset.theme);
});

const userName = localStorage.getItem('userName') || 'U';
el('user-avatar') && (el('user-avatar').textContent = userName.charAt(0).toUpperCase());

renderBudgets();
