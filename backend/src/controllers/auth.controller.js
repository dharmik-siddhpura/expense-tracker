const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User.model');
const Category = require('../models/Category.model');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const defaultCategories = [
  { name: 'Salary',        color: '#10b981', icon: '💼', type: 'income'  },
  { name: 'Freelance',     color: '#06b6d4', icon: '💻', type: 'income'  },
  { name: 'Food',          color: '#f59e0b', icon: '🍔', type: 'expense' },
  { name: 'Transport',     color: '#3b82f6', icon: '🚗', type: 'expense' },
  { name: 'Entertainment', color: '#8b5cf6', icon: '🎬', type: 'expense' },
  { name: 'Shopping',      color: '#ec4899', icon: '🛍️', type: 'expense' },
  { name: 'Health',        color: '#ef4444', icon: '🏥', type: 'expense' },
  { name: 'Bills',         color: '#f97316', icon: '📄', type: 'expense' },
  { name: 'Education',     color: '#6366f1', icon: '📚', type: 'expense' },
  { name: 'Other',         color: '#6b7280', icon: '📦', type: 'both'    },
];

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { name, email, password, currency } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already exists' });
    const user = await User.create({ name, email, password, currency });
    await Category.insertMany(defaultCategories.map(c => ({ ...c, userId: user._id })));
    res.status(201).json({ success: true, token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({ success: true, token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, currency } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, currency }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
