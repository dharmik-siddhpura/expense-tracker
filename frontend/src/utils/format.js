export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const getMonthYear = (date = new Date()) => ({
  month: date.getMonth() + 1,
  year: date.getFullYear(),
});

export const CATEGORY_COLORS = {
  Salary: '#10b981', Freelance: '#06b6d4', Food: '#f59e0b',
  Transport: '#3b82f6', Entertainment: '#8b5cf6', Shopping: '#ec4899',
  Health: '#ef4444', Bills: '#f97316', Education: '#6366f1', Other: '#6b7280',
};
