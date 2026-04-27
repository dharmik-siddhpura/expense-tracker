const Budget = require('../models/Budget.model');
const Transaction = require('../models/Transaction.model');

exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = Number(month || now.getMonth() + 1);
    const y = Number(year  || now.getFullYear());

    const budgets = await Budget.find({ userId: req.user._id, month: m, year: y });

    const start = new Date(y, m - 1, 1);
    const end   = new Date(y, m, 0, 23, 59, 59);

    const enriched = await Promise.all(budgets.map(async (b) => {
      const spent = await Transaction.aggregate([
        { $match: { userId: req.user._id, category: b.category, type: 'expense', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      const spentAmt = spent[0]?.total || 0;
      return { ...b.toObject(), spent: spentAmt, percentage: ((spentAmt / b.limit) * 100).toFixed(1) };
    }));

    res.json({ success: true, budgets: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.setBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, category, month, year },
      { limit },
      { upsert: true, new: true }
    );
    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
