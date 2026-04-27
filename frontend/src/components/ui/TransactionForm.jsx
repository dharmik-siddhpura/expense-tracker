import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function TransactionForm({ onSubmit, initial, onClose }) {
  const [form, setForm] = useState({
    title: '', amount: '', type: 'expense', category: 'Food',
    date: new Date().toISOString().split('T')[0], notes: '', recurring: false,
    ...initial,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  const filtered = categories.filter(c => c.type === form.type || c.type === 'both');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
        {['expense', 'income'].map(t => (
          <button key={t} type="button"
            onClick={() => setForm(f => ({ ...f, type: t }))}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition
              ${form.type === t
                ? t === 'expense' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                : 'text-slate-500'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Title</label>
        <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="e.g. Lunch at restaurant"
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Amount (₹)</label>
        <input required type="number" min="1" value={form.amount}
          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
          placeholder="0"
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          {filtered.map(c => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Date</label>
        <input type="date" required value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Notes (optional)</label>
        <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="Any additional notes..."
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
        <input type="checkbox" checked={form.recurring}
          onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))}
          className="w-4 h-4 accent-indigo-500" />
        Mark as recurring (monthly)
      </label>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
          Cancel
        </button>
        <button type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 text-sm font-medium transition">
          {initial?._id ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
}
