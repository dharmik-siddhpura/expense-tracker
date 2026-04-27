const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, getMe, updateProfile, deleteAccount } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], login);

router.get('/me',     protect, getMe);
router.put('/me',     protect, updateProfile);
router.delete('/me',  protect, deleteAccount);

module.exports = router;
