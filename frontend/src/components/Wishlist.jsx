import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { wishlistActions } from '../store/wishlistSlice';
import { bagActions } from '../store/bagslice';
import Header from './header.jsx';
import Footer from './footer.jsx';
import DraggableWhatsApp from './DraggableWhatsApp';
import { motion } from 'framer-motion';
import { useState } from 'react';

function Wishlist() {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const bagItems = useSelector((state) => state.bag.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addedToBag, setAddedToBag] = useState(null);

  const insertWidth = (url, width) => {
    if (!url) return '';
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;
    const prefix = url.slice(0, uploadIndex + 8);
    const suffix = url.slice(uploadIndex + 8);
    return `${prefix}w_${width},f_webp,q_auto/${suffix}`;
  };

  const handleProductClick = (product) => {
    if (product.stock > 0) {
      localStorage.setItem('category', '');
      navigate(`/ProductDescription/${product._id}`, { state: { product } });
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    dispatch(wishlistActions.removeFromWishlist({ _id: productId }));
  };

  const handleMoveToBag = (product) => {
    const productWithBagId = {
      ...product,
      bagid: bagItems.length,
      quantity: 1,
      // Bag/Checkout expects `image` (string), wishlist stores `imageUrl` (array)
      image: product.imageUrl?.[0] || product.image || '',
      discount: product.discountPercentage || product.discount || 0,
    };
    dispatch(bagActions.addItemToBag(productWithBagId));
    setAddedToBag(product._id);
    setTimeout(() => setAddedToBag(null), 2000);
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

  return (
    <>
      <Header />
      <DraggableWhatsApp />

      <div className="container mx-auto px-4 py-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-serif">My Wishlist</h1>
              <div className="w-20 h-1 bg-amber-500 mt-2"></div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2 rounded-full border border-amber-500 text-amber-600 hover:bg-amber-50 transition-colors text-sm"
            >
              Continue Shopping
            </button>
          </div>

          {wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">❤️</div>
              <p className="text-xl text-gray-600 mb-6">Your wishlist is empty</p>
              <p className="text-gray-500 mb-8">Add items you love to your wishlist and save them for later!</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Explore Products
              </button>
            </motion.div>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-8">You have {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {wishlistItems.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={item}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className="relative pb-[145%] bg-gray-50 overflow-hidden cursor-pointer group"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <img
                          src={insertWidth(product.imageUrl?.[0] || '', 500)}
                          alt={product.name}
                          className="absolute w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        {product.imageUrl?.[1] && (
                          <img
                            src={insertWidth(product.imageUrl[1], 500)}
                            alt={product.name}
                            className="absolute w-full h-full object-cover translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                            loading="lazy"
                          />
                        )}
                      </div>

                      {product.discountPercentage && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                          {product.discountPercentage}% OFF
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWishlist(product._id);
                        }}
                        className="absolute top-3 right-12 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition-colors"
                        title="Remove from wishlist"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-4">
                      <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">{product.category}</p>
                      <h3 className="text-sm font-semibold mb-2 line-clamp-2 hover:text-amber-600 cursor-pointer" onClick={() => handleProductClick(product)}>
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        {product.discountPercentage ? (
                          <>
                            <span className="text-xs text-gray-400 line-through">Rs.{Math.round(product.price).toLocaleString()}</span>
                            <span className="text-sm font-bold text-red-600">
                              Rs.{Math.round(product.price * (1 - product.discountPercentage / 100)).toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-800">Rs.{Math.round(product.price).toLocaleString()}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }}
                          onClick={() => handleMoveToBag(product)}
                          disabled={product.stock <= 0}
                          className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 ${
                            addedToBag === product._id
                              ? 'bg-green-500 text-white'
                              : product.stock > 0
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {addedToBag === product._id ? '✓ Added' : 'Move to Bag'}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }}
                          onClick={() => handleProductClick(product)}
                          disabled={product.stock <= 0}
                          className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 ${
                            product.stock > 0
                              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          View
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Wishlist;
