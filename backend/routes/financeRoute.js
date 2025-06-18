
// ✅ ROUTER (routes/financeRoute.js)
const express = require("express");
const { protectAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  monthlySales,
  expectedSales,
  topProducts,
} = require("../controllers/financeController");

router.get("/monthly-sales",protectAdmin, monthlySales);
router.get("/expected-sales",protectAdmin, expectedSales);
router.get("/top-products",protectAdmin, topProducts);

module.exports = router;
