const express = require('express');
const router = express.Router();
const {
    login,
    getAdmins,
    deleteAdmin,
    getTraffic,
    getCosts,
    addInstruction,
    getInstructions,
    getOrders,
    updateOrderPriority,
    getDashboardStats
} = require('./superadminController');
const { superadminProtect } = require('./superadminMiddleware');

// Public route
router.post('/login', login);

// Protected routes
router.use(superadminProtect);

router.get('/admins', getAdmins);
router.delete('/admins/:id', deleteAdmin);

router.get('/traffic', getTraffic);

router.get('/costs', getCosts);

router.post('/instructions', addInstruction);
router.get('/instructions', getInstructions);

router.get('/orders', getOrders);
router.put('/orders/:id/priority', updateOrderPriority);

router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
