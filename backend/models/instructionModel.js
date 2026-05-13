const mongoose = require('mongoose');

const instructionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null }, // If null, it's for all admins
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'read', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Instruction', instructionSchema);
