const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: String,
  name: String,
  quantity: Number,
  selectedSize: String,
  category: String,
  style: String, // optional
});

const orderSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: false,   // 👈 Now optional
    default: null      // 👈 Default is null
  },
  products: [productSchema],
  shipping: Number,
  address: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    apartment: String,
    city: String,
    country: String,
    postalCode: String,
  },
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
