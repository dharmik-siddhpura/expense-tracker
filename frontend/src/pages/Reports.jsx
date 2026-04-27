import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
  const { user } = useAuth();
  const [yearData, setYearData]   = useState([]);
  const [year, setYear]           = useState(new Date().getFullYear());
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchYearData = async () => {
      setLoading(true);
      const months = [];
      for (let m = 1; m <= 12; m++) {
        try {
          const res = await api.get(`/transactions/summary?month=${m}&year=${year}`);
          months.push({
            month: new Date(year, m - 1).toLocaleString('default', { month: 'short' }),
            income:  res.data.summary.totalIncome,
            expense: res.data.summary.totalExpense,
            balance: res.data.summary.balance,
          });
        } catch { months.push({ month: '', income: 0, expense: 0, balance: 0 }); }
      }
      setYearData(months);
      setLoading(false);
    };
    fetchYearData();
  }, [year]);

  const handleExport = async () => {
    try {
      const res = await api.get(`/transactions/export?year=${year}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = `report-${year}.csv`; a.click();
      toast.success('Exported!');
    } catch { toast.error('Export failed'); }
  };

  const totalIncome  = yearData.reduce((s, d) => s + d.income, 0);
  const totalExpense = yearData.reduce((s, d) => s + d.expense, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Reports</h2>
          <p className="text-sm text-slate-400">Annual financial overview</p>
        </div>
        <div className="flex gap-2">
          <select value={year} onChange={e => setYear(Number(e.target.value))}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={handleExport}
            className="flex items-center gap-2 border border-slate-200 text-slate-500 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Income',   value: totalIncome,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Expenses', value: totalExpense, color: 'text-red-500',     bg: 'bg-red-50'     },
          { label: 'Net Savings',    value: totalBalance, color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-5 border border-slate-100`}>
            <p className="text-sm text-slate-500 mb-1">{label} ({year})</p>
            <p className={`text-2xl font-bold ${color}`}>{formatCurrency(value, user?.currency)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4">Monthly Overview — {year}</h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={yearData} barGap={4}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip formatter={(v) => formatCurrency(v, user?.currency)} />
              <Legend />
              <Bar dataKey="income"  name="Income"  fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {['Month','Income','Expenses','Balance','Savings %'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {yearData.map((d, i) => {
              const savings = d.income > 0 ? ((d.balance / d.income) * 100).toFixed(1) : 0;
              return (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-medium text-slate-700">{d.month}</td>
                  <td className="px-5 py-3 text-emerald-600">{formatCurrency(d.income, user?.currency)}</td>
                  <td className="px-5 py-3 text-red-500">{formatCurrency(d.expense, user?.currency)}</td>
                  <td className={`px-5 py-3 font-semibold ${d.balance >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
                    {formatCurrency(d.balance, user?.currency)}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{savings}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
