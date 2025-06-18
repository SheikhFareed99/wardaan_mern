const express = require('express');
const router = express.Router();
const expenditureController = require('../controllers/expenditureController');
const { protectAdmin } = require("../middleware/authMiddleware");

router.post('/',protectAdmin, expenditureController.addExpenditure); // Add
router.get('/', protectAdmin,expenditureController.getAllExpenditures); // Get all
router.get('/total',protectAdmin, expenditureController.getTotalExpenditure); // Get total sum
router.delete('/:id',protectAdmin, expenditureController.deleteExpenditure); // Delete one

module.exports = router;
