const express = require('express');
const router = express.Router();
const expenditureController = require('../controllers/expenditureController');

router.post('/', expenditureController.addExpenditure); // Add
router.get('/', expenditureController.getAllExpenditures); // Get all
router.get('/total', expenditureController.getTotalExpenditure); // Get total sum
router.delete('/:id', expenditureController.deleteExpenditure); // Delete one

module.exports = router;
