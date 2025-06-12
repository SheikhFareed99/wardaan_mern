const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/:category", getAllProducts);
router.post("/", addProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
