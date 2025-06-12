const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  invoiceDate: { type: Date, default: Date.now },
  totalAmount: Number,
  customerName: String,
  customerEmail: String,
  products: [
    {
      name: String,
      quantity: Number,
      selectedSize: String,
      category: String,
      style: String,
    },
  ],
});

module.exports = mongoose.model('Invoice', invoiceSchema);
