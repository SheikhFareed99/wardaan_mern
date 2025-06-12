// routes/protectedAdminRoutes.js
const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/dashboard", protectAdmin, (req, res) => {
  res.json({ message: "Welcome to admin dashboard" });
});

module.exports = router;
