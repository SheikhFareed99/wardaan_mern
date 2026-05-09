const Expenditure = require('../models/Expenditure');

// POST /api/expenditures → Add new expenditure
exports.addExpenditure = async (req, res) => {
  try {
    const { amount, description, date } = req.body;

    const expenditure = new Expenditure({ amount, description, date });
    await expenditure.save();

    res.status(201).json(expenditure);
  } catch (err) {
    console.error("Error adding expenditure:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// GET all expenditures with optional date filtering
exports.getAllExpenditures = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};

    if (from && to) {
      query.date = { $gte: new Date(from), $lte: new Date(to) };
    }

    const expenditures = await Expenditure.find(query).sort({ date: -1 });
    res.json(expenditures);
  } catch (err) {
    console.error("Error fetching expenditures:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Total expenditure with date filtering
exports.getTotalExpenditure = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};

    if (from && to) {
      query.date = { $gte: new Date(from), $lte: new Date(to) };
    }

    const expenditures = await Expenditure.find(query);
    const total = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
    res.json({ total });
  } catch (err) {
    console.error("Error calculating total expenditure:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /api/expenditures/:id → Delete a specific expenditure
exports.deleteExpenditure = async (req, res) => {
  try {
    await Expenditure.findByIdAndDelete(req.params.id);
    res.json({ message: "Expenditure deleted" });
  } catch (err) {
    console.error("Error deleting expenditure:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
