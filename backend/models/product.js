const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String, // e.g., 'kameez shalwar', 'chappal'
    required: true,
  },

  subCategory: {
    type: String, // e.g., 'casual', 'formal'
  },

  brand: {
    type: String,
    default: "Wardaan",
  },

  price: {
    type: Number,
    required: true,
  },

  discountPercentage: {
    type: Number,
    default: 0,
  },

  sizes: {
    type: [String], // e.g., ["S", "M", "L"] or ["7", "8", "9"]
    default: [],
  },

  color: {
    type: String,
  },

  season: {
    type: String, // e.g., "Summer", "All Season"
  },

  imageUrl: {
    type: [String], // image URLs
    default: [],
  },

  stock: {
    type: Number,
    required: true,
  },

  fabric: {
    type: String, // For kameez shalwar
  },

  fitting: {
    type: String, // For chappals
  },

  styleOptions: {
    type: [String],
    default: [],
  },

  specialAttribute: {
    type: String, 
    default: "",
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("product", productSchema);
