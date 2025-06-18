const Order = require('../models/orderModel');
const Product = require('../models/product');
const mongoose = require('mongoose');


exports.monthlySales = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { status: 'completed' };

    if (from && to) {
      query.orderDate = { $gte: new Date(from), $lte: new Date(to) };
    }

    const orders = await Order.find(query);
    const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({ total});

  } catch (err) {
    console.error("Error in expectedSales:", err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.expectedSales = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { status: 'active' };

    if (from && to) {
      query.orderDate = { $gte: new Date(from), $lte: new Date(to) };
    }

    const orders = await Order.find(query);
    const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({ total});

  } catch (err) {
    console.error("Error in expectedSales:", err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.topProducts = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};

    if (from && to) {
      query.orderDate = { $gte: new Date(from), $lte: new Date(to) };
    }

    const orders = await Order.find(query);

    const productSalesMap = {};

    orders.forEach(order => {
      order.products.forEach(product => {
        if (!productSalesMap[product.name]) {
          productSalesMap[product.name] = 0;
        }
        productSalesMap[product.name] += product.quantity;
      });
    });

    const products = Object.entries(productSalesMap)
      .map(([name, totalSold]) => ({ name, totalSold }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    res.json({ products });
  } catch (err) {
    console.error("Error in topProducts:", err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

