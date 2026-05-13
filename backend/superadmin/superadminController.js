const SuperAdmin = require('../models/superadminModel');
const Admin = require('../models/adminModel');
const Order = require('../models/orderModel');
const Traffic = require('../models/trafficModel');
const Expenditure = require('../models/Expenditure');
const Instruction = require('../models/instructionModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Special case for the requested credentials if not in DB
        if (username === 'superadmin123' && password === 'super123') {
            const token = jwt.sign({ id: 'superadmin', role: 'superadmin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
            return res.json({ token, username: 'Super Admin' });
        }

        const superadmin = await SuperAdmin.findOne({ username });
        if (superadmin && (await bcrypt.compare(password, superadmin.password))) {
            const token = jwt.sign({ id: superadmin._id, role: 'superadmin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
            res.json({ token, username: superadmin.username });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manage Accounts (Admins)
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}).select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admin deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Monitor Web Traffic
exports.getTraffic = async (req, res) => {
    try {
        const traffic = await Traffic.find().sort({ timestamp: -1 }).limit(100);
        const stats = await Traffic.aggregate([
            { $group: { _id: "$path", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json({ traffic, stats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// See Costs
exports.getCosts = async (req, res) => {
    try {
        const costs = await Expenditure.find({}).sort({ date: -1 });
        const totalCost = await Expenditure.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        res.json({ costs, total: totalCost[0] ? totalCost[0].total : 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Give Instructions
exports.addInstruction = async (req, res) => {
    try {
        const { content, adminId, priority } = req.body;
        const instruction = await Instruction.create({ content, adminId, priority });
        res.status(201).json(instruction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInstructions = async (req, res) => {
    try {
        const instructions = await Instruction.find({}).populate('adminId', 'email').sort({ createdAt: -1 });
        res.json(instructions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manage Customer Orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Priority to Order
exports.updateOrderPriority = async (req, res) => {
    try {
        const { priority } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { priority }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View other website handlings (Dashboard stats)
exports.getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalAdmins = await Admin.countDocuments();
        const totalTraffic = await Traffic.countDocuments();
        const recentOrders = await Order.find().sort({ orderDate: -1 }).limit(5);
        
        res.json({
            totalOrders,
            totalAdmins,
            totalTraffic,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
