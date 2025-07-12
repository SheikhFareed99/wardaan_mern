import Header from './header.jsx';
import Footer from './footer.jsx';
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DraggableWhatsApp from "./DraggableWhatsApp";
import axios from 'axios';
import { motion } from "framer-motion";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const categoryRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchdata = async () => {
      try {
        const response = await axios.get(`https://wardaan-mern.onrender.com/api/products/allproducts`);
        console.log(response.data);
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchdata();
  }, []);

  const handleProductClick = (product) => {
    if (product.stock > 0) {
      navigate(`/ProductDescrition/${product.id}`, { state: { product } });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      <meta name="google-site-verification" content="gqP-Pu_jI8l3-mNtKz-kb2wFwpMBdnGaPUNF5Eztin8" />
      <DraggableWhatsApp />

      {/* Hero Section */}
    {/* Hero Section */}
<div className="relative w-full">
  <div className="relative w-full min-h-[50vh] sm:min-h-[65vh] md:min-h-[75vh] lg:min-h-[100vh]">
    <img
      className="absolute w-full h-full object-cover brightness-90"
      src="https://res.cloudinary.com/dswff96z5/image/upload/v1752352295/WhatsApp_Image_2025-07-13_at_01.31.03_d2d97509_cg1g5w.jpg"
      alt="main_pic"
      loading="eager"
    />
    <div className="absolute inset-0 flex flex-col justify-end items-center text-center px-4 pb-8 sm:pb-2 md:pb-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-yellow-800 mb-4 [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
        A Legacy Woven In Tradition
      </h1>
      <button
        onClick={() => categoryRef.current?.scrollIntoView({ behavior: "smooth" })}
        className="px-6 py-2 sm:px-8 sm:py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-base font-medium rounded-full shadow-lg transition duration-300"
      >
        Explore More
      </button>
    </div>
  </div>
</div>
      {/* Shop by Category Section */}
      <div ref={categoryRef} className="py-12 px-4 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 capitalize text-center font-serif text-gray-800"
        >
          Shop by Category
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-2"></div>
        </motion.h1>

        <div className="flex gap-4 overflow-x-auto pb-4 whitespace-nowrap">
          {[
            { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154573/OIP_jspxrv.webp", title: "kameez-shalwar" },
            { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154572/OIP_1_oar9jt.webp", title: "chappal" },
            { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154572/download_d9wl5z.webp", title: "Vardaans-Special" },
            { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154572/OIP_1_gfgr8r.jpg", title: "Vardaans-Unstitched" }
          ].map(({ src, title }, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/products/${encodeURIComponent(title)}`)}
              className="cursor-pointer relative w-[270px] sm:w-[240px] md:w-[270px] h-[22rem] sm:h-[20rem] md:h-[24rem] rounded-xl overflow-hidden shadow-md group flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={src}
                alt={title}
                className="w-full h-full object-cover object-top transition-transform duration-500 transform group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h2 className="absolute bottom-3 left-3 text-white text-base font-bold drop-shadow-md">
                {title}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* All Products Section */}
      <div className="container mx-auto px-1 py-8 min-h-screen">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 capitalize text-center font-serif text-gray-800"
        >
          All products
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-2"></div>
        </motion.h1>

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
            <p className="text-xl text-gray-600">No products found.</p>
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
                <div
                  className="relative pb-[145%] bg-gray-50 overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (product.stock > 0) handleProductClick(product);
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <img
                      src={product.imageUrl[0]}
                      alt={`${product.name} default`}
                      className="absolute w-full h-full object-cover transition-transform duration-500"
                    />
                    {product.imageUrl[1] && (
                      <img
                        src={product.imageUrl[1]}
                        alt={`${product.name} hover`}
                        className={`absolute w-full h-full object-cover translate-x-full ${product.stock > 0 ? 'group-hover:translate-x-0' : ''} transition-transform duration-500`}
                      />
                    )}
                  </div>
                  {product.discountPercentage && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md transform rotate-12">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                  {product.stock > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center py-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-sm">QUICK VIEW</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3
                    className={`text-sm font-semibold mb-2 line-clamp-2 ${product.stock > 0 ? 'hover:text-amber-600 cursor-pointer' : 'cursor-default'}`}
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

      {/* Video Section */}
      <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
        <video
          src="https://res.cloudinary.com/dswff96z5/video/upload/v1752351108/IMG_0972_ddwwud.mov"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-auto object-cover"
        />
      </div>

      <Footer />
    </>
  );
}

export default Home;