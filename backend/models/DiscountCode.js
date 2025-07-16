const mongoose = require('mongoose');

const DiscountCode = new mongoose.Schema({
    code: { type: String, required: true, unique: true },  
    Limit: { type: Number, required: true }               
});

module.exports = mongoose.model("DiscountTable", DiscountCode);
