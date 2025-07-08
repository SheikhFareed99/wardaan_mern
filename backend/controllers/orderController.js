const Order = require('../models/orderModel');
const Invoice = require('../models/invoiceModel');
const Product = require('../models/product'); // ✅ Product model

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Step 1: Get original order
    const originalOrder = await Order.findById(id);
    if (!originalOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const wasNotCancelled = originalOrder.status !== 'cancelled';
    const isCancellingNow = updates.status === 'cancelled';

    // Step 2: Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    // Step 3: Only restore stock if order status changed to "cancelled"
    if (wasNotCancelled && isCancellingNow) {
      for (const item of originalOrder.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      }
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.GetselectedOrders=async (req, res) => {
    const s = req.query.status;
  try {

    const orders = await Order.find({ status: s }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};


exports.GetselectedOrders=async (req, res) => {
    const s = req.query.status;
    if(s=='all'){
 try {
                  
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
    }
    else
    {
 try {
                  
    const orders = await Order.find({ status: s }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
    }
 
};

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


exports.orderstatus = async (req, res) => {
  const id = req.params.status;

  try {
    const response = await Order.findOne({ _id: id });

    if (!response) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      status: response.shippingStatus,
      trackingNumber: response.trackingNumber
    });
  } catch (err) {
    return res.status(400).json({
      error: "Error fetching order status",
      message: err.message
    });
  }
};

