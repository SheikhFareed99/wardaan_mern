const Product = require("../models/product");

const getAllProducts = async (req, res) => {
  const products = await Product.find(req.params.category ? { category: req.params.category } : {});
  if (!products.length) {
    return res.status(404).json({ message: "No products found" });
  }
  res.json(products);
};

const addProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json(newProduct);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.status(204).end();
};

module.exports = {
  getAllProducts,
  addProduct,
  deleteProduct,
};
