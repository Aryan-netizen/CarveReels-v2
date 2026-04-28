const { createOrder, getOrders, getOrdersForFoodPartner, updateOrderStatus, cancelOrder } = require('../Controllers/OrderController');
const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();

// Customer routes
router.post('/create', ensureAuthenticated, createOrder);
router.get('/my-orders', ensureAuthenticated, getOrders);
router.post('/cancel', ensureAuthenticated, cancelOrder);

// Food Partner routes
router.get('/partner-orders', ensureAuthenticated, getOrdersForFoodPartner);
router.post('/update-status', ensureAuthenticated, updateOrderStatus);

module.exports = router;
