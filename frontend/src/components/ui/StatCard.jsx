export default function StatCard({ title, value, icon: Icon, color, sub }) {
  const colors = {
    green:  { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600' },
    red:    { bg: 'bg-red-50',     icon: 'bg-red-500',     text: 'text-red-600'     },
    indigo: { bg: 'bg-indigo-50',  icon: 'bg-indigo-500',  text: 'text-indigo-600'  },
    amber:  { bg: 'bg-amber-50',   icon: 'bg-amber-500',   text: 'text-amber-600'   },
  };
  const c = colors[color] || colors.indigo;
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500 font-medium">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center`}>
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
      </div>
      <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
