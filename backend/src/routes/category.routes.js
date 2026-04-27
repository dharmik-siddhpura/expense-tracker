const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { getCategories, addCategory, deleteCategory } = require('../controllers/category.controller');

router.use(protect);
router.get('/',       getCategories);
router.post('/',      addCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
