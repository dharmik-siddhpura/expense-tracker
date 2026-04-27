const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, required: true, trim: true },
  amount:    { type: Number, required: true, min: 0 },
  type:      { type: String, required: true, enum: ['income', 'expense'] },
  category:  { type: String, required: true },
  date:      { type: Date, required: true, default: Date.now },
  notes:     { type: String, default: '' },
  recurring: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
