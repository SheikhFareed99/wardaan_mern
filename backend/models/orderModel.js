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
    required: false,
    default: null
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

  // ✅ Order Status and Tracking Info
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed', 'shipped'],
    default: 'active'
  },
  trackingNumber: {
    type: String,
    default: null
  },
  shippingStatus: {
    type: String,
    enum: ['pending', 'in transit', 'delivered'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['Normal', 'High', 'Urgent'],
    default: 'Normal'
  }
});

module.exports = mongoose.model('Order', orderSchema);
