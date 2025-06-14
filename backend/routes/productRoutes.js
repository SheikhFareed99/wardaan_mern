const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  updateProducts,
  getproducts,
  deleteProduct,
  addProduct,
  addAllDiscount
} = require("../controllers/productController");

router.get("/admin", getproducts);     

router.delete("/admin/:id", deleteProduct);

router.put("/admin/:id", updateProducts);

router.get("/:category", getAllProducts);   

router.post('/admin', addProduct);

router.patch('/admin/discount-all', addAllDiscount);


module.exports = router;
