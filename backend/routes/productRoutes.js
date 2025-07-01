const express = require("express");
const { protectAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  getAllProducts,
  updateProducts,
  getproducts,
  deleteProduct,
  addProduct,
  addAllDiscount,
  discountedProducts,
  SpecialProducts,
  unstitchedProducts,
  getall
} = require("../controllers/productController");

router.get("/allproducts",getall); 

router.get("/admin",protectAdmin, getproducts);     

router.delete("/admin/:id",protectAdmin, deleteProduct);

router.put("/admin/:id",protectAdmin, updateProducts);

router.get("/discounted", discountedProducts);

router.get("/Special", SpecialProducts);

router.get("/unstitched", unstitchedProducts);

router.get("/:category", getAllProducts);

router.post('/admin',protectAdmin, addProduct);

router.patch('/admin/discount-all',protectAdmin, addAllDiscount);


module.exports = router;
