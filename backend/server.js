const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const orderRoutes = require('./routes/orderRoutes');
const financeRoute = require('./routes/financeRoute');
const expenditureRoutes = require('./routes/expenditureRoutes');
const Product = require('./models/product');


dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/views", express.static(path.join(__dirname, "public", "views")));

app.use("/api/products", productRoutes);

app.use('/api/orders', orderRoutes);

app.use("/api/admin/protected", require("./routes/protectedAdminRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/finance", financeRoute);

app.use('/api/expenditures', expenditureRoutes);


//  for insta catalog
app.get('/feed/products.csv', async (req, res) => {
  try {
    const products = await Product.find({});

    let csv = `id,title,description,availability,price,discount_percentage,discounted_price,link,image_link\n`;

    products.forEach((p) => {
      const id = p._id.toString();
      const title = p.name.replace(/,/g, " ");
      const description = p.description.replace(/,/g, " ");
      const availability = p.stock > 0 ? "in stock" : "out of stock";
      const price = Number(p.price);
      const discountPercentage = Number(p.discountPercentage) || 0;
      const discountedPrice = (price - (price * discountPercentage / 100)).toFixed(0);
      const priceStr = `${price} PKR`;
      const discountedStr = `${discountedPrice} PKR`;
      const link = `https://vardaanswear.pk/ProductDescrition/${id}`;
      const image = p.imageUrl[0] || "";

      csv += `${id},${title},${description},${availability},${priceStr},${discountPercentage},${discountedStr},${link},${image}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.status(200).send(csv);

  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Wardaan backend running on http://localhost:${PORT}`);
});
