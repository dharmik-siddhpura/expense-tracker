import { guardPage, logout } from './auth.js';
import { api } from './api.js';
import { formatCurrency, formatDate, getCategoryIcon, getUserCurrency, showToast } from './utils.js';

guardPage();
const currency = getUserCurrency();
let editingId = null;

const el = (id) => document.getElementById(id);

const renderTable = async () => {
  const type     = el('filter-type').value;
  const month    = el('filter-month').value;
  const year     = el('filter-year').value;
  let url = `/transactions?`;
  if (type)  url += `type=${type}&`;
  if (month) url += `month=${month}&`;
  if (year)  url += `year=${year}`;

  el('table-body').innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem"><div class="spinner"></div></td></tr>';
  try {
    const res  = await api.get(url);
    const list = res.data;
    el('txn-count').textContent = `${list.length} transactions`;
    if (!list.length) {
      el('table-body').innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="icon">🔍</div><p>No transactions found</p></div></td></tr>';
      return;
    }
    el('table-body').innerHTML = list.map(t => `
      <tr>
        <td><span style="font-size:1.2rem">${getCategoryIcon(t.category)}</span> ${t.title}</td>
        <td><span class="badge badge-${t.type === 'INCOME' ? 'income' : 'expense'}">${t.type}</span></td>
        <td>${t.category}</td>
        <td class="${t.type === 'INCOME' ? 'text-success' : 'text-danger'}" style="font-weight:700">
          ${t.type === 'INCOME' ? '+' : '-'}${formatCurrency(t.amount, currency)}
        </td>
        <td>${formatDate(t.txnDate)}</td>
        <td>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-sm" onclick="editTxn(${t.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteTxn(${t.id})">Delete</button>
          </div>
        </td>
      </tr>`).join('');
  } catch {}
};

window.editTxn = async (id) => {
  try {
    const res = await api.get(`/transactions?`);
    const t   = res.data.find(x => x.id === id);
    if (!t) return;
    editingId = id;
    const f = el('txn-form');
    f.title.value    = t.title;
    f.amount.value   = t.amount;
    f.type.value     = t.type;
    f.category.value = t.category;
    f.txnDate.value  = t.txnDate;
    f.notes.value    = t.notes || '';
    el('modal-title').textContent = 'Edit Transaction';
    el('txn-modal').classList.remove('hidden');
  } catch {}
};

window.deleteTxn = async (id) => {
  if (!confirm('Delete this transaction?')) return;
  try {
    await api.delete(`/transactions/${id}`);
    showToast('Deleted', 'success');
    renderTable();
  } catch {}
};

el('add-btn')?.addEventListener('click', () => {
  editingId = null;
  el('txn-form').reset();
  el('modal-title').textContent = 'Add Transaction';
  el('txn-modal').classList.remove('hidden');
});

el('modal-close')?.addEventListener('click', () => el('txn-modal').classList.add('hidden'));
el('txn-modal')?.addEventListener('click', e => { if (e.target === el('txn-modal')) el('txn-modal').classList.add('hidden'); });

el('txn-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = el('txn-form');
  const body = {
    title: f.title.value, amount: Number(f.amount.value),
    type: f.type.value, category: f.category.value,
    txnDate: f.txnDate.value, notes: f.notes.value || '',
  };
  try {
    if (editingId) {
      await api.put(`/transactions/${editingId}`, body);
      showToast('Updated!', 'success');
    } else {
      await api.post('/transactions', body);
      showToast('Added!', 'success');
    }
    el('txn-modal').classList.add('hidden');
    renderTable();
  } catch {}
});

el('filter-type')?.addEventListener('change', renderTable);
el('filter-month')?.addEventListener('change', renderTable);
el('filter-year')?.addEventListener('change', renderTable);

el('export-btn')?.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8080/api/transactions/export/csv', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
  showToast('Exported!', 'success');
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

renderTable();
