const Transaction = require('../models/Transaction.model');

exports.getTransactions = async (req, res) => {
  try {
    const { month, year, category, type, search, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user._id };
    if (category) query.category = category;
    if (type)     query.type = type;
    if (search)   query.title = { $regex: search, $options: 'i' };
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end   = new Date(year, month, 0, 23, 59, 59);
      query.date  = { $gte: start, $lte: end };
    }
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, page: Number(page), transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body, { new: true }
    );
    if (!transaction) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = Number(month || now.getMonth() + 1);
    const y = Number(year  || now.getFullYear());

    const start = new Date(y, m - 1, 1);
    const end   = new Date(y, m, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      userId: req.user._id, date: { $gte: start, $lte: end }
    });

    const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance      = totalIncome - totalExpense;
    const savingsRate  = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    // Category breakdown for pie chart
    const categoryMap = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    // Last 6 months bar chart data
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(y, m - 1 - i, 1);
      const s = new Date(d.getFullYear(), d.getMonth(), 1);
      const e = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const txs = await Transaction.find({ userId: req.user._id, date: { $gte: s, $lte: e } });
      monthlyData.push({
        month: s.toLocaleString('default', { month: 'short' }),
        income:  txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      });
    }

    const recent = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 }).limit(8);

    res.json({
      success: true,
      summary: { totalIncome, totalExpense, balance, savingsRate },
      categoryBreakdown: categoryMap,
      monthlyData,
      recent,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { userId: req.user._id };
    if (month && year) {
      query.date = { $gte: new Date(year, month - 1, 1), $lte: new Date(year, month, 0, 23, 59, 59) };
    }
    const transactions = await Transaction.find(query).sort({ date: -1 });
    const rows = ['Title,Amount,Type,Category,Date,Notes'];
    transactions.forEach(t => {
      rows.push(`"${t.title}",${t.amount},${t.type},${t.category},${new Date(t.date).toLocaleDateString()},"${t.notes}"`);
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(rows.join('\n'));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
