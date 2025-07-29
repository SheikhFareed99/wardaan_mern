import { useParams, useNavigate } from "react-router-dom";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import DraggableWhatsApp from "./DraggableWhatsApp";

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
        let apiCategory = category;
  
        if (category === "kameez-shalwar") {
          apiCategory = "kameez shalwar";
        } else if (category === "Vardaan-Special") {
          apiCategory = "Special";
        } else if (category === "Discount") {
          apiCategory = "discounted";
        }
        else if (category === "chappal")
        {
          apiCategory = "chappal";
        }
        else{
          apiCategory = "unstitched";
        }
  
        const endpoint = `https://wardaan-mern.onrender.com/api/products/${apiCategory}`;
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
  
  const insertWidth = (url, width) => {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return url;
    const prefix = url.slice(0, uploadIndex + 8); // includes '/upload/'
    const suffix = url.slice(uploadIndex + 8);

    return `${prefix}w_${width},f_auto,q_auto/${suffix}`;
  };


  const handleProductClick = (product) => {
    if (product.stock > 0) {
      localStorage.setItem("category",category)
      navigate(`/ProductDescription/${product._id}`);
    }
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
      <DraggableWhatsApp />
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
                whileHover={{ y: product.stock > 0 ? -5 : 0 }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden relative group transition-all duration-300 ${product.stock > 0 ? 'hover:shadow-xl' : ''}`}
              >
                {/* Image container */}
                <div 
  className="relative pb-[145%] bg-gray-50 overflow-hidden cursor-pointer"
  onClick={() => {
    if (product.stock > 0) handleProductClick(product);
  }}
>
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
    {/* Base image */}
    <img
                      src={insertWidth(product.imageUrl[0], 1000)}
                      srcSet={`
                        ${insertWidth(product.imageUrl[0], 500)} 1000w,
                        ${insertWidth(product.imageUrl[0], 1000)} 1000w,
                        ${insertWidth(product.imageUrl[0], 1600)} 1000w
                      `}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      alt={`${product.name} default`}
      className="absolute w-full h-full object-cover transition-transform duration-500"
      loading="lazy"
    />

    {/* Hover image */}
    {product.imageUrl[1] && (
      <img
      loading="lazy"
                        src={insertWidth(product.imageUrl[1], 1000)}
                        srcSet={`
                          ${insertWidth(product.imageUrl[1], 500)} 1000w,
                          ${insertWidth(product.imageUrl[1], 1000)} 1000w,
                          ${insertWidth(product.imageUrl[1], 1600)} 1000w
                        `}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        alt={`${product.name} hover`}
        className={`absolute w-full h-full object-cover translate-x-full ${product.stock > 0 ? 'group-hover:translate-x-0' : ''} transition-transform duration-500`}
      />
    )}
  </div>

  {/* Discount badge */}
  {product.discountPercentage && (
    <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md transform rotate-12">
      {product.discountPercentage}% OFF
    </div>
  )}

  {/* Quick view only if in stock */}
  {product.stock > 0 && (
    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center py-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
      <span className="text-sm">QUICK VIEW</span>
    </div>
  )}
</div>

                {/* Product info */}
                <div className="p-4">
                  <h3 
                    className={`text-sm font-semibold mb-2 line-clamp-2 ${product.stock > 0 ? 'hover:text-amber-600 cursor-pointer' : 'cursor-default'}`}
                    onClick={() => handleProductClick(product)}
                  >
                    {product.name}
                  </h3>
                  
                  {/* unstitched */}
                  {category==="Vardaans-Unstitched"? <div className="flex items-center gap-2 mb-3">
                    {product.discountPercentage ? (
                      <>
                        <span className="text-xs text-gray-400 line-through">Rs.{(Math.round(product.price-1215)).toLocaleString()}</span>
                        <span className="text-sm font-bold text-red-600">
                          Rs.{Math.round((product.price-1215) * (1 - product.discountPercentage / 100)).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-gray-800">Rs.{Math.round(product.price-1215).toLocaleString()}</span>
                    )}
                     {/* stitched */}
                  </div>: <div className="flex items-center gap-2 mb-3">
                    {product.discountPercentage ? (
                      <>
                        <span className="text-xs text-gray-400 line-through">Rs.{(Math.round(product.price)).toLocaleString()}</span>
                        <span className="text-sm font-bold text-red-600">
                          Rs.{Math.round(product.price * (1 - product.discountPercentage / 100)).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-gray-800">Rs.{Math.round(product.price.toLocaleString())}</span>
                    )}
                  </div> }
                 


                 
                  
                  <motion.button 
                    whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }}
                    className={`w-full py-2 rounded-md text-sm font-medium ${
                      product.stock > 0
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md cursor-pointer' 
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