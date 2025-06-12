const Order = require('../models/orderModel');
const Invoice = require('../models/invoiceModel');
const Product = require('../models/product'); // ✅ Product model

exports.placeOrder = async (req, res) => {
  try {
    let {
      customerId,
      products,
      shipping,
      address,
      totalAmount
    } = req.body;

    // Handle guest checkout
    if (!customerId || customerId === '0' || customerId === 0) {
      customerId = null;
    }

    const filteredProducts = [];

    // ✅ Check stock and update product stock
    for (const p of products) {
      const product = await Product.findById(p.id);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${p.name}` });
      }

      if (product.stock < p.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}`,
          availableStock: product.stock,
        });
      }

      // ✅ Subtract stock and save
      product.stock -= p.quantity;
      await product.save();

      // Build cleaned product entry for order & invoice
      const productEntry = {
        productId: p.id,
        name: p.name,
        quantity: p.quantity,
        selectedSize: p.selectedSize,
        category: p.category,
      };

      if (p.category !== 'chappal') {
        productEntry.style = p.style;
      }

      filteredProducts.push(productEntry);
    }

    // ✅ Create and save order
    const newOrder = new Order({
      customerId,
      products: filteredProducts,
      shipping,
      address,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    // ✅ Create and save invoice
    const invoice = new Invoice({
      orderId: savedOrder._id,
      totalAmount,
      invoiceDate: new Date(),
      customerName: `${address.firstName} ${address.lastName}`,
      customerEmail: address.email,
      products: filteredProducts.map(p => ({
        name: p.name,
        quantity: p.quantity,
        selectedSize: p.selectedSize,
        category: p.category,
        style: p.style || '',
      })),
    });

    await invoice.save();

    res.status(201).json({
      message: 'Order placed and invoice generated',
      orderId: savedOrder._id,
    });

  } catch (error) {
    console.error('Order Placement Error:', error);
    res.status(500).json({ message: 'Failed to place order', error });
  }
};
