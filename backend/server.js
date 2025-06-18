const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const orderRoutes = require('./routes/orderRoutes');
const financeRoute = require('./routes/financeRoute');
const expenditureRoutes = require('./routes/expenditureRoutes');


dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/products", productRoutes);

app.use('/api/orders', orderRoutes);

app.use("/api/admin/protected", require("./routes/protectedAdminRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/finance", financeRoute);

app.use('/api/expenditures', expenditureRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Wardaan backend running on http://localhost:${PORT}`);
});



