import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Plus } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getMonthYear } from '../utils/format';
import StatCard from '../components/ui/StatCard';
import TransactionItem from '../components/ui/TransactionItem';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/ui/TransactionForm';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const { month, year }       = getMonthYear();

  const fetchData = async () => {
    try {
      const res = await api.get(`/transactions/summary?month=${month}&year=${year}`);
      setData(res.data);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (form) => {
    try {
      await api.post('/transactions', form);
      toast.success('Transaction added!');
      setShowAdd(false);
      fetchData();
    } catch { toast.error('Failed to add transaction'); }
  };

  const pieData = data ? Object.entries(data.categoryBreakdown).map(([name, value]) => ({ name, value })) : [];
  const PIE_COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#ec4899','#8b5cf6','#f97316'];

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const { totalIncome, totalExpense, balance, savingsRate } = data?.summary || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Good morning, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-sm text-slate-400">Here's your financial summary</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Income"   value={formatCurrency(totalIncome,  user?.currency)} icon={TrendingUp}   color="green"  />
        <StatCard title="Total Expenses" value={formatCurrency(totalExpense, user?.currency)} icon={TrendingDown} color="red"    />
        <StatCard title="Net Balance"    value={formatCurrency(balance,      user?.currency)} icon={Wallet}       color="indigo" />
        <StatCard title="Savings Rate"   value={`${savingsRate}%`}                            icon={PiggyBank}    color="amber" sub="of income saved" />
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">Income vs Expenses (6 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.monthlyData} barGap={4}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip formatter={(v) => formatCurrency(v, user?.currency)} />
              <Legend />
              <Bar dataKey="income"  name="Income"  fill="#10b981" radius={[6,6,0,0]} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">Spending by Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v, user?.currency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-300">
              <span className="text-4xl mb-2">📊</span>
              <p className="text-sm">No expense data yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-700">Recent Transactions</h3>
        </div>
        {data?.recent?.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {data.recent.map(tx => (
              <TransactionItem key={tx._id} tx={tx} currency={user?.currency} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 text-slate-300">
            <span className="text-4xl mb-2">💸</span>
            <p className="text-sm">No transactions yet. Add one!</p>
          </div>
        )}
      </div>

      {showAdd && (
        <Modal title="Add Transaction" onClose={() => setShowAdd(false)}>
          <TransactionForm onSubmit={handleAdd} onClose={() => setShowAdd(false)} />
        </Modal>
      )}
    </div>
  );
}
