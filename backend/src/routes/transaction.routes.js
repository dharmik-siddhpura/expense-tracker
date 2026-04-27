const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getTransactions, addTransaction, updateTransaction,
  deleteTransaction, getSummary, exportCSV,
} = require('../controllers/transaction.controller');

router.use(protect);
router.get('/summary', getSummary);
router.get('/export',  exportCSV);
router.get('/',        getTransactions);
router.post('/',       addTransaction);
router.put('/:id',     updateTransaction);
router.delete('/:id',  deleteTransaction);

module.exports = router;
