
// ✅ ROUTER (routes/financeRoute.js)
const express = require("express");
const router = express.Router();
const {
  monthlySales,
  expectedSales,
  topProducts,
} = require("../controllers/financeController");

router.get("/monthly-sales", monthlySales);
router.get("/expected-sales", expectedSales);
router.get("/top-products", topProducts);

module.exports = router;
