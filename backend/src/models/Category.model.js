const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:   { type: String, required: true, trim: true },
  color:  { type: String, default: '#6366f1' },
  icon:   { type: String, default: '📦' },
  type:   { type: String, enum: ['income', 'expense', 'both'], default: 'both' },
}, { timestamps: true });

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
