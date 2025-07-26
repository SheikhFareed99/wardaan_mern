const Product = require("../models/product");
const Feedback=require("../models/feedback");



const addFeedback = async (req, res) => {
  try {
    const { name, review, star } = req.body;
    const feedback = new Feedback({ name, review, star });
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    res.status(500).json({ error: "Failed to add feedback", details: err.message });
  }
};


const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedbacks", details: err.message });
  }
};


const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json({ message: "Status updated", feedback: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status", details: err.message });
  }
};


const getAllProducts = async (req, res) => {
  const products = await Product.find(req.params.category ? { category: req.params.category } : {});
  if (!products.length) {
    return res.status(404).json({ message: "No products found" });
  }
  res.json(products);
};



const getproducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

const getselectedproduct = async (req, res) => {
  const product = await Product.find(req.params.id);
  res.json(product);
};


// Delete a product
const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted successfully" });
};

// Update a product
const updateProducts =async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
};

const addProduct= async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

const addAllDiscount = async (req, res) => {
  try {
    const { discountPercentage } = req.body;
    await Product.updateMany({}, { discountPercentage });
    res.send({ message: `Discount applied to all products successfully!` });
  } catch (error) {
    res.status(500).send(error);
  }
};

const discountedProducts = async (req, res) => {

  try {
    const products = await Product.find({ discountPercentage: { $gt: 0 } });
    if (!products.length) {
      return res.status(404).json({ message: "No discounted products found" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
};

const SpecialProducts=async (req,res)=>
{
  try
  {
    const product=await Product.find({ specialAttribute: "yes" });
    if (!product.length) {
      return res.status(404).json({ message: "No special products found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

const unstitchedProducts=async (req,res)=>
{
  try
  {
  const product= await Product.find({subCategory:"Unstitched"});
  if (!product.length) {
    return res.status(404).json({ message: "No unstitched products found" });
  }
  res.json(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getall=async (req,res)=>
{
  const products = await Product.find({});
  if (!products.length) {
    return res.status(404).json({ message: "No products found" });
  }
  res.json(products);
}
module.exports = {
  getAllProducts,
   getproducts,
  deleteProduct,
  updateProducts,
  addProduct,
  addAllDiscount,
  discountedProducts,
  SpecialProducts,
  unstitchedProducts,
  getall,
  addFeedback,
  getAllFeedbacks,
  updateFeedbackStatus,
  getselectedproduct
};
