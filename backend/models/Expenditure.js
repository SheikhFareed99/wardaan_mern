const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({

  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Expenditure", expenditureSchema);