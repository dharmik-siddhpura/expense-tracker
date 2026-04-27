const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { getBudgets, setBudget, deleteBudget } = require('../controllers/budget.controller');

router.use(protect);
router.get('/',        getBudgets);
router.post('/',       setBudget);
router.delete('/:id',  deleteBudget);

module.exports = router;
