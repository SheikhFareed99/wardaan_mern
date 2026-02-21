const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protectAdmin } = require("../middleware/authMiddleware");
const rateLimit = require('express-rate-limit');

const Order = require("../models/orderModel");

const adminApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/DiscountCode/:code',orderController.DiscountCode);

router.post('/DiscountCode', adminApiLimiter, protectAdmin, orderController.InsertCode);

router.delete('/DiscountCode', adminApiLimiter, protectAdmin, orderController.DeleteCode);

router.get('/AllDiscountedCodes', adminApiLimiter, protectAdmin, orderController.getDiscountedCodes);

router.get('/orderid/:status', orderController.orderstatus);

router.get("/", protectAdmin,orderController.GetselectedOrders); 


router.post('/', orderController.placeOrder);




router.patch('/:id', protectAdmin, orderController.updateOrder);
module.exports = router;
