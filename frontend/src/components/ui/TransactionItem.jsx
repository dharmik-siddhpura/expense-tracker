import { formatCurrency, formatDate, CATEGORY_COLORS } from '../../utils/format';
import { Pencil, Trash2 } from 'lucide-react';

export default function TransactionItem({ tx, currency, onEdit, onDelete }) {
  const color = CATEGORY_COLORS[tx.category] || '#6b7280';
  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-slate-50 transition group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: color + '20' }}>
        <span>{getCategoryIcon(tx.category)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 truncate">{tx.title}</p>
        <p className="text-xs text-slate-400">{tx.category} · {formatDate(tx.date)}</p>
      </div>
      <div className="text-right">
        <p className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
        </p>
      </div>
      {(onEdit || onDelete) && (
        <div className="hidden group-hover:flex gap-1">
          {onEdit && (
            <button onClick={() => onEdit(tx)}
              className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-500 transition">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(tx._id)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const icons = { Salary:'💼', Freelance:'💻', Food:'🍔', Transport:'🚗',
  Entertainment:'🎬', Shopping:'🛍️', Health:'🏥', Bills:'📄', Education:'📚', Other:'📦' };

const getCategoryIcon = (cat) => icons[cat] || '📦';
