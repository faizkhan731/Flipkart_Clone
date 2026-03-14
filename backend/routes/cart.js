const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartCount } = require('../controllers/cartController');

router.get('/', getCart);
router.get('/count', getCartCount);
router.post('/add', addToCart);
router.put('/:id', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/:id', removeFromCart);

module.exports = router;
