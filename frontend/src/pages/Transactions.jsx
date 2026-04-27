import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TransactionItem from '../components/ui/TransactionItem';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/ui/TransactionForm';
import toast from 'react-hot-toast';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [editing, setEditing]           = useState(null);
  const [filters, setFilters] = useState({
    search: '', type: '', category: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(),
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')));
      const res = await api.get(`/transactions?${params}`);
      setTransactions(res.data.transactions);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load transactions'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleSubmit = async (form) => {
    try {
      if (editing) {
        await api.put(`/transactions/${editing._id}`, form);
        toast.success('Updated!');
      } else {
        await api.post('/transactions', form);
        toast.success('Added!');
      }
      setShowModal(false); setEditing(null); fetchTransactions();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Deleted');
      fetchTransactions();
    } catch { toast.error('Failed to delete'); }
  };

  const handleExport = async () => {
    try {
      const res = await api.get(`/transactions/export?month=${filters.month}&year=${filters.year}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
      toast.success('Exported!');
    } catch { toast.error('Export failed'); }
  };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Transactions</h2>
          <p className="text-sm text-slate-400">{total} transactions found</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport}
            className="flex items-center gap-2 border border-slate-200 text-slate-500 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-medium transition">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => { setEditing(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filters.month} onChange={e => setFilters(f => ({ ...f, month: e.target.value }))}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-slate-50 px-2 py-2">
            {transactions.map(tx => (
              <TransactionItem key={tx._id} tx={tx} currency={user?.currency}
                onEdit={(tx) => { setEditing(tx); setShowModal(true); }}
                onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-slate-300">
            <span className="text-5xl mb-3">🔍</span>
            <p className="text-sm">No transactions found</p>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Transaction' : 'Add Transaction'}
          onClose={() => { setShowModal(false); setEditing(null); }}>
          <TransactionForm onSubmit={handleSubmit} initial={editing}
            onClose={() => { setShowModal(false); setEditing(null); }} />
        </Modal>
      )}
    </div>
  );
}
