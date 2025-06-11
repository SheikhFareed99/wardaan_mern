const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Wardaan backend running on http://localhost:${PORT}`);
});




// const sampleProducts = [
//     {
//       id: 1,
//       name: "Classic White Kameez Shalwar",
//       description: "Premium cotton kameez shalwar for formal occasions.",
//       category: "kameez shalwar",
//       price: 4499,
//       discountPercentage: 10,
//       sizes: ["S", "M", "L", "XL"],
//       styleOptions:["Ban / Shalwar", "Ban / Trouser", "Collar / Shalwar"],
//       color: "White",
//       season: "Summer",
//       brand: "Wardaan",
//       imageUrl: ["/pictures/men-shalwar-kameez-dark-brown-stylish-garments-pk-1.jpg", 
//          "/pictures/il_fullxfull.6326430442_6znz (1).avif",
//          "/pictures/il_fullxfull.6326430442_6znz (1).avif",
//          "/pictures/il_fullxfull.6326430442_6znz (1).avif"],
//       stock: 15,
//       fabric: "Cotton"
//     },
//     {
//       id: 2,
//       name: "Brown Leather Peshawari Sandals",
//       description: "Handcrafted traditional sandals with durable leather finish.",
//       category: "chappal",
//       price: 3499,
//       discountPercentage: 5,
//       sizes: ["7", "8", "9", "10"],
//       color: "Brown",
//       season: "All Season",
//       brand: "Wardaan",
//       imageUrl: ["/pictures/men-shalwar-kameez-dark-brown-stylish-garments-pk-1.jpg", 
//         "/pictures/il_fullxfull.6326430442_6znz (1).avif",
//         "/pictures/il_fullxfull.6326430442_6znz (1).avif",
//         "/pictures/il_fullxfull.6326430442_6znz (1).avif"],
//       stock: 10,
//       fitting: "True to size"
//     },
//     {
//       id: 3,
//       name: "Casual Black Kurta",
//       description: "Lightweight black kurta for everyday comfort.",
//       category: "kameez shalwar",
//       price: 2999,
//       discountPercentage: 15,
//       sizes: ["S", "M", "L"],
//       color: "Black",
//       season: "Summer",
//       brand: "Wardaan",
//       styleOptions:["Ban / Shalwar", "Ban / Trouser", "Collar / Shalwar"],
//       imageUrl: ["/pictures/men-shalwar-kameez-dark-brown-stylish-garments-pk-1.jpg", 
//         "/pictures/il_fullxfull.6326430442_6znz (1).avif",
//         "/pictures/il_fullxfull.6326430442_6znz (1).avif",
//         "/pictures/il_fullxfull.6326430442_6znz (1).avif"],
//       stock: 25,
//       fabric: "Cotton Blend"
//     },
//     {
//       id: 4,
//       name: "Traditional Khussa",
//       description: "Embroidered khussa perfect for weddings and events.",
//       category: "chappal",
//       price: 3999,
//       discountPercentage: 20,
//       sizes: ["6", "7", "8", "9"],
//       color: "Gold",
//       season: "Winter",
//       brand: "Wardaan",
//       imageUrl: ["/pictures/OIP.jpg", 
//         "/pictures/il_fullxfull.6326430442_6znz (1).avif",
//         "/pictures/il_fullxfull.6326430442_6znz (1).avif",
//         "/pictures/il_fullxfull.6326430442_6znz (1).avif"],
//       stock: 8,
//       fitting: "Snug fit"
//     }
//   ];
  
//   app.get('/products', (req, res) => {
//     res.send(sampleProducts);
//   });
