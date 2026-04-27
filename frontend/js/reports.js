import { guardPage, logout } from './auth.js';
import { api } from './api.js';
import { formatCurrency, getUserCurrency, showToast } from './utils.js';

guardPage();
const currency = getUserCurrency();
let chart = null;

const el = (id) => document.getElementById(id);

const renderReport = async () => {
  const year = el('year-select').value;
  try {
    const res  = await api.get(`/reports/monthly?year=${year}`);
    const data = res.data.data;

    const ctx = el('report-chart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
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

    const totalIncome  = data.reduce((s, d) => s + Number(d.income),  0);
    const totalExpense = data.reduce((s, d) => s + Number(d.expense), 0);
    el('total-income').textContent  = formatCurrency(totalIncome,  currency);
    el('total-expense').textContent = formatCurrency(totalExpense, currency);
    el('total-savings').textContent = formatCurrency(totalIncome - totalExpense, currency);

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    el('monthly-table').innerHTML = data.map((d, i) => {
      const income  = Number(d.income);
      const expense = Number(d.expense);
      const balance = income - expense;
      const savings = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;
      return `<tr>
        <td><strong>${months[i]}</strong></td>
        <td class="text-success">${formatCurrency(income, currency)}</td>
        <td class="text-danger">${formatCurrency(expense, currency)}</td>
        <td class="${balance >= 0 ? 'text-success' : 'text-danger'}" style="font-weight:700">${formatCurrency(balance, currency)}</td>
        <td>${savings}%</td>
      </tr>`;
    }).join('');
  } catch {}
};

el('year-select')?.addEventListener('change', renderReport);
el('export-btn')?.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8080/api/transactions/export/csv', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `report-${el('year-select').value}.csv`; a.click();
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

renderReport();
