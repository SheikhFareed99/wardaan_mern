import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { wishlistActions } from '../store/wishlistSlice';
import { bagActions } from '../store/bagslice';
import Header from './header.jsx';
import Footer from './footer.jsx';
import DraggableWhatsApp from './DraggableWhatsApp';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function Wishlist() {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const bagItems = useSelector((state) => state.bag.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addedToBag, setAddedToBag] = useState(null);

  // Size-selection modal state
  const [sizeModal, setSizeModal] = useState(null); // holds the product being moved
  const [modalSize, setModalSize] = useState(null);
  const [modalStyle, setModalStyle] = useState(0);

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

  // Opens the size-picker modal instead of adding directly
  const handleMoveToBagClick = (product) => {
    setModalSize(null);
    setModalStyle(0);
    setSizeModal(product);
  };

  // Called when user confirms a size inside the modal
  const handleConfirmMoveToBag = () => {
    if (!sizeModal) return;
    const needsSize = sizeModal.category !== 'unstitched';
    if (needsSize && modalSize === null) return;

    const productWithBagId = {
      ...sizeModal,
      id: sizeModal._id,          // backend uses p.id for Product.findById()
      bagid: bagItems.length,
      quantity: 1,
      image: sizeModal.imageUrl?.[0] || sizeModal.image || '',
      discount: sizeModal.discountPercentage || sizeModal.discount || 0,
      selectedSize: needsSize ? (sizeModal.sizes?.[modalSize] ?? modalSize) : 'nill',
      style: sizeModal.styleOptions?.[modalStyle] ?? 'nill',
    };
    dispatch(bagActions.addItemToBag(productWithBagId));
    setSizeModal(null);
    setAddedToBag(sizeModal._id);
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
                          onClick={() => handleMoveToBagClick(product)}
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

      {/* ── Size selection modal ── */}
      <AnimatePresence>
        {sizeModal && (
          <motion.div
            key="size-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6"
            onClick={() => setSizeModal(null)}
          >
            <motion.div
              key="size-modal-panel"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
                <div>
                  <h2 className="font-bold text-gray-900 text-base leading-tight">{sizeModal.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Select size to move to bag</p>
                </div>
                <button
                  onClick={() => setSizeModal(null)}
                  className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-5 py-4 space-y-5">
                {/* Style options (kameez shalwar only) */}
                {sizeModal.category === 'kameez shalwar' && sizeModal.styleOptions?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Style</p>
                    <div className="flex flex-wrap gap-2">
                      {sizeModal.styleOptions.map((style, idx) => (
                        <button
                          key={style}
                          onClick={() => setModalStyle(idx)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            modalStyle === idx
                              ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                              : 'border-gray-200 text-gray-700 hover:border-amber-300'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size grid */}
                {sizeModal.sizes?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Size</p>
                    <div className="grid grid-cols-5 gap-2">
                      {sizeModal.sizes.map((size, idx) => (
                        <button
                          key={size}
                          onClick={() => setModalSize(idx)}
                          className={`aspect-square flex items-center justify-center rounded-xl text-sm font-semibold border transition-all ${
                            modalSize === idx
                              ? 'bg-amber-500 border-amber-500 text-white shadow-md scale-105'
                              : 'border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {modalSize === null && (
                      <p className="text-xs text-red-500 mt-2">Please select a size to continue</p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 flex gap-3">
                <button
                  onClick={() => setSizeModal(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmMoveToBag}
                  disabled={sizeModal.sizes?.length > 0 && modalSize === null}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                    sizeModal.sizes?.length > 0 && modalSize === null
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md'
                  }`}
                >
                  Move to Bag
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default Wishlist;
