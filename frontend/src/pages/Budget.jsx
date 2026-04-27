import { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export default function Budget() {
  const { user } = useAuth();
  const now = new Date();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category: 'Food', limit: '', month: now.getMonth() + 1, year: now.getFullYear() });

  const fetchBudgets = async () => {
    const res = await api.get(`/budgets?month=${now.getMonth() + 1}&year=${now.getFullYear()}`);
    setBudgets(res.data.budgets);
  };

  useEffect(() => {
    fetchBudgets();
    api.get('/categories').then(r => setCategories(r.data.categories.filter(c => c.type !== 'income')));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', { ...form, limit: Number(form.limit) });
      toast.success('Budget set!');
      setShowAdd(false);
      fetchBudgets();
    } catch { toast.error('Failed to set budget'); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      toast.success('Budget removed');
      fetchBudgets();
    } catch { toast.error('Failed to delete'); }
  };

  const getBarColor = (pct) => {
    if (pct >= 100) return 'bg-red-500';
    if (pct >= 80)  return 'bg-amber-400';
    return 'bg-indigo-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Budget Planner</h2>
          <p className="text-sm text-slate-400">Set and track your monthly spending limits</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Set Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 flex flex-col items-center text-slate-300 shadow-sm border border-slate-100">
          <span className="text-5xl mb-3">🎯</span>
          <p className="text-sm">No budgets set yet. Start planning!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {budgets.map(b => {
            const pct = Math.min(Number(b.percentage), 100);
            return (
              <div key={b._id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-700">{b.category}</h3>
                    <p className="text-xs text-slate-400">
                      {formatCurrency(b.spent, user?.currency)} / {formatCurrency(b.limit, user?.currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {Number(b.percentage) >= 80 && (
                      <AlertTriangle className={`w-4 h-4 ${Number(b.percentage) >= 100 ? 'text-red-500' : 'text-amber-400'}`} />
                    )}
                    <button onClick={() => handleDelete(b._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${getBarColor(pct)}`}
                    style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className={`text-xs font-semibold ${Number(b.percentage) >= 100 ? 'text-red-500' : Number(b.percentage) >= 80 ? 'text-amber-500' : 'text-indigo-500'}`}>
                    {b.percentage}% used
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatCurrency(Math.max(b.limit - b.spent, 0), user?.currency)} left
                  </span>
                </div>
                {Number(b.percentage) >= 80 && Number(b.percentage) < 100 && (
                  <p className="text-xs text-amber-500 mt-2 bg-amber-50 px-3 py-1.5 rounded-lg">
                    ⚠️ Approaching budget limit!
                  </p>
                )}
                {Number(b.percentage) >= 100 && (
                  <p className="text-xs text-red-500 mt-2 bg-red-50 px-3 py-1.5 rounded-lg">
                    🚨 Budget exceeded!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <Modal title="Set Monthly Budget" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {categories.map(c => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Budget Limit (₹)</label>
              <input required type="number" min="1" value={form.limit}
                onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
                placeholder="e.g. 5000"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAdd(false)}
                className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 text-sm font-medium transition">
                Set Budget
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
