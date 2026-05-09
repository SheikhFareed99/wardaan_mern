import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRecentlyViewed } from '../utils/recentlyViewedUtils';

function RecentlyViewedProducts() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const viewed = getRecentlyViewed();
    setRecentlyViewed(viewed);
  }, []);

  const handlePrevious = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleProductClick = (product) => {
    if (product.stock > 0) {
      localStorage.setItem('category', '');
      navigate(`/ProductDescription/${product._id}`, { state: { product } });
    }
  };

  const insertWidth = (url, width) => {
    if (!url) return '';
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;
    const prefix = url.slice(0, uploadIndex + 8);
    const suffix = url.slice(uploadIndex + 8);
    return `${prefix}w_${width},f_webp,q_auto/${suffix}`;
  };

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="w-full px-4 sm:px-8 py-12"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Recently Viewed</h2>
          <p className="text-gray-600 text-sm sm:text-base">Continue shopping from where you left off</p>
        </div>

        <div className="relative group">
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-amber-500 text-gray-700 hover:text-white rounded-full p-2 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recentlyViewed.map((product, index) => (
              <motion.div
                key={`${product._id}-${index}`}
                onClick={() => handleProductClick(product)}
                className="flex-shrink-0 w-56 cursor-pointer group/card"
                whileHover={{ y: -4 }}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 h-full">
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

                  <div className="p-3">
                    <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">{product.category}</p>
                    <h3 className="text-sm font-bold text-gray-800 truncate mb-2">{product.name}</h3>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        Rs {Math.round(product.price - (product.price * product.discountPercentage) / 100)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 line-through">Rs {product.price}</span>
                      )}
                    </div>

                    <button className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md text-sm font-semibold transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-amber-500 text-gray-700 hover:text-white rounded-full p-2 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

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
