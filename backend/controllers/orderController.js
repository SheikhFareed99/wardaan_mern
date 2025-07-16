const Order = require('../models/orderModel');
const Invoice = require('../models/invoiceModel');
const Product = require('../models/product');
const Discount=require('../models/DiscountCode')
const nodemailer = require("nodemailer");

// reusable transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or use 'hotmail', 'yahoo', or a custom SMTP
  auth: {
    user: 'thevardaansofficial@gmail.com',        // replace with your email
    pass: 'agfdpfeqepiehctn',        // use Gmail App Password (not regular password)
  },
});

async function sendConfirmationEmail(toEmail, firstName, orderId) {
  const mailOptions = {
    from: '"Vardaan Wear" <thevardaansofficial@gmail.com>',
    to: toEmail,
    subject: `Vardaan Order Confirmation - Order #${orderId}`,
    html: `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Hi ${firstName},</h2>
        <p>🎉 Thank you for your order! <br/>
        Your order <strong>#${orderId}</strong> has been successfully placed.</p>
        <p>We will process and deliver it in <strong>3–4 working days</strong>.</p>
        <p>You'll hear from us if there's anything else we need.</p>
        <br/>
        <p style="font-size: 14px;">Regards,<br/><strong>Team Wardaan</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email sending failed:", err);
  }
}

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

if (address.email) {
  await sendConfirmationEmail(address.email, address.firstName, savedOrder._id);
}

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


exports.DiscountCode = async (req, res) => {
  const disCode = req.params.code;
  try {
    const result = await Discount.findOne({ code: disCode });
    if (!result) {
      return res.status(404).json({ message: "Discount code not found" });
    }
    return res.status(200).json({ amount: result.Limit });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 2. Insert new discount code
exports.InsertCode = async (req, res) => {
  const { DisCode, amount } = req.body;

  try {
    const resp = await Discount.create({ code: DisCode, Limit: amount }); 
    res.status(200).json({ message: "Code is inserted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 3. Get all discount codes
exports.getDiscountedCodes = async (req, res) => {
  try {
    const resp = await Discount.find({});
    res.status(200).json({ codes: resp });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 4. Delete discount code
exports.DeleteCode = async (req, res) => {
  const { DisCode } = req.body; 

  try {
    const resp = await Discount.deleteOne({ code: DisCode });
    if (resp.deletedCount === 0) {
      return res.status(404).json({ message: "Discount code not found" });
    }
    res.status(200).json({ message: "Code is deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
