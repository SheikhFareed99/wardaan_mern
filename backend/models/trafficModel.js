const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema({
    path: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Traffic', trafficSchema);
