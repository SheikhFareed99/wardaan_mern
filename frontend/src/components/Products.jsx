import { useParams, useNavigate } from "react-router-dom";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";

function Products() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        let endpoint = '';
        if (category === "kameez shalwar" || category === "chappal") {
          endpoint = `http://localhost:5000/api/products/${category}`;
        } else if (category === "Wardaan Special") {
          endpoint = `http://localhost:5000/api/products/Special`;
        } else if (category === "Discount") {
          endpoint = `http://localhost:5000/api/products/discounted`;
        } else {
          endpoint = `http://localhost:5000/api/products/unstitched`;
        }

        const res = await axios.get(endpoint);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const handleProductClick = (product) => {
    navigate(`/ProductDescrition/${product.id}`, { state: { product } });
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const shimmerItem = {
    hidden: { opacity: 0.5 },
    show: { 
      opacity: 1,
      transition: { 
        repeat: Infinity, 
        repeatType: "reverse", 
        duration: 1.5 
      } 
    }
  };

  return (
    <>  
      <Header />
   
      <div className="container mx-auto px-1 py-8 min-h-screen">
        {category && (
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-8 capitalize text-center font-serif text-gray-800"
          >
            {category}
            <div className="w-20 h-1 bg-amber-500 mx-auto mt-2"></div>
          </motion.h1>
        )}
        
        {isLoading ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4"
          >
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                variants={shimmerItem}
                className="bg-gray-100 rounded-lg overflow-hidden"
                style={{ height: '350px' }}
              >
                <div className="h-60 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse mt-4"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">😕</div>
            <p className="text-xl text-gray-600">No products found in this category.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors duration-300"
            >
              Continue Shopping
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4"
          >
            {products.map(product => (
              <motion.div
                key={product.id}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden relative group transition-all duration-300 hover:shadow-xl"
              >
                {/* Image container with hover effect */}
                <div 
                  className="relative pb-[145%] bg-gray-50 overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                 <img 
  src={product.imageUrl[0]} 
  alt={product.name}
  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  loading="lazy"  // Add this
/>
                  
                  {/* Discount badge */}
                  {product.discountPercentage && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md transform rotate-12">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                  
                  {/* Out of stock overlay */}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg tracking-wider">SOLD OUT</span>
                    </div>
                  )}
                  
                  {/* Quick view button */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center py-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-sm">QUICK VIEW</span>
                  </div>
                </div>
                
                {/* Product info */}
                <div className="p-4">
                  <h3 
                    className="text-sm font-semibold mb-2 line-clamp-2 hover:text-amber-600 transition-colors cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {product.discountPercentage ? (
                      <>
                        <span className="text-xs text-gray-400 line-through">Rs.{product.price.toLocaleString()}</span>
                        <span className="text-sm font-bold text-red-600">
                          Rs.{(product.price * (1 - product.discountPercentage / 100)).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-gray-800">Rs.{product.price.toLocaleString()}</span>
                    )}
                  </div>
                  
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-2 rounded-md text-sm font-medium ${
                      product.stock > 0
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-all duration-300`}
                    disabled={product.stock <= 0}
                    onClick={() => handleProductClick(product)}
                  >
                    {product.stock > 0 ? (
                      <span className="flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        ADD TO BAG
                      </span>
                    ) : 'Out of Stock'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      <Footer />
    </>
  );
}

export default Products;