const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth',         require('./src/routes/auth.routes'));
app.use('/api/transactions', require('./src/routes/transaction.routes'));
app.use('/api/budgets',      require('./src/routes/budget.routes'));
app.use('/api/categories',   require('./src/routes/category.routes'));

app.get('/', (req, res) => res.json({ message: 'Expense Tracker API running' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
