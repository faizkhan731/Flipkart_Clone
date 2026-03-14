const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getOrderById } = require('../controllers/orderController');

router.post('/place', placeOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrderById);

module.exports = router;
