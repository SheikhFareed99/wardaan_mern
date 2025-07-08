const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protectAdmin } = require("../middleware/authMiddleware");

const Order = require("../models/orderModel");

router.get('/orderid/:status', orderController.orderstatus);

router.get("/", protectAdmin,orderController.GetselectedOrders); 


router.post('/', orderController.placeOrder);



router.patch('/:id', protectAdmin, orderController.updateOrder);
module.exports = router;
