const Category = require('../models/Category.model');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id }).sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const category = await Category.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, category });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Category already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
