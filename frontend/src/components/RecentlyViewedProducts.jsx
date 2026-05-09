import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRecentlyViewed } from '../utils/recentlyViewedUtils';

function RecentlyViewedProducts() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showSlider, setShowSlider] = useState(false);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const viewed = getRecentlyViewed();
    if (viewed.length > 0) {
      setRecentlyViewed(viewed);
      setShowSlider(true);
    }
  }, []);

  const handlePrevious = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  const handleProductClick = (product) => {
    if (product.stock > 0) {
      localStorage.setItem("category", "");
      navigate(`/ProductDescription/${product._id}`, { state: { product } });
    }
  };

  const insertWidth = (url, width) => {
    if (!url) return '';
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return url;
    const prefix = url.slice(0, uploadIndex + 8);
    const suffix = url.slice(uploadIndex + 8);
    return `${prefix}w_${width},f_webp,q_auto/${suffix}`;
  };

  if (!showSlider || recentlyViewed.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="w-full px-4 sm:px-8 py-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2"
            variants={itemVariants}
          >
            ✨ Recently Viewed
          </motion.h2>
          <motion.p
            className="text-gray-600 text-sm sm:text-base"
            variants={itemVariants}
          >
            Continue shopping from where you left off
          </motion.p>
        </div>

        {/* Slider Container */}
        <div className="relative group">
          {/* Previous Button */}
          <motion.button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-amber-500 text-gray-700 hover:text-white rounded-full p-2 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Products Scroll */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recentlyViewed.map((product, index) => (
              <motion.div
                key={`${product._id}-${index}`}
                onClick={() => handleProductClick(product)}
                className="flex-shrink-0 w-56 cursor-pointer group/card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 h-full">
                  {/* Product Image */}
                  <div className="relative h-56 bg-gray-200 overflow-hidden">
                    <img
                      src={insertWidth(product.imageUrl?.[0] || '', 400)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                    />
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discountPercentage}%
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">{product.category}</p>
                    <h3 className="text-sm font-bold text-gray-800 truncate mb-2">{product.name}</h3>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        Rs {Math.round(product.price - (product.price * product.discountPercentage) / 100)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          Rs {product.price}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-xs">★</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">(0)</span>
                    </div>

                    {/* Quick Add Button */}
                    <motion.button
                      className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md text-sm font-semibold transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-amber-500 text-gray-700 hover:text-white rounded-full p-2 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {recentlyViewed.length} item{recentlyViewed.length !== 1 ? 's' : ''} viewed
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
}

export default RecentlyViewedProducts;
