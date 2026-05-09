import Header from './header.jsx';
import Footer from './footer.jsx';
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { wishlistActions } from '../store/wishlistSlice';
import DraggableWhatsApp from "./DraggableWhatsApp";
import RecentlyViewedProducts from "./RecentlyViewedProducts";
import axios from 'axios';
import { motion } from "framer-motion";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    review: '',
    star: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const categoryRef = useRef(null);
  const feedbackContainerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (typeof fbq !== "undefined") {
      fbq('track', 'ViewContent', {
        content_name: 'Home Page',
        content_category: 'Landing',
        content_type: 'home',
      });
    }

    const fetchData = async () => {
      try {
        // Fetch products and feedbacks in parallel
        const [productResponse, feedbackResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/products/allproducts`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/products/feedbacks`)
        ]);
        setProducts(productResponse.data);

        const approvedFeedbacks = Array.isArray(feedbackResponse.data)
          ? feedbackResponse.data.filter(fb => fb.status === true)
          : [];
        setFeedbacks(approvedFeedbacks);
        if (approvedFeedbacks.length === 0) {
          console.log('No approved feedbacks found');
        }
      } catch (err) {
        console.error('Error fetching data:', err.response?.status, err.response?.data || err.message);
        setSubmitMessage('Failed to load feedbacks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const id = target.getAttribute('href').slice(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, { passive: true });
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const insertWidth = (url, width) => {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return url;
    const prefix = url.slice(0, uploadIndex + 8);
    const suffix = url.slice(uploadIndex + 8);
    return `${prefix}w_${width},f_webp,q_auto/${suffix}`;
  };

  const handleProductClick = (product) => {
    if (product.stock > 0) {
      localStorage.setItem("category", "");
      navigate(`/ProductDescription/${product._id}`, { state: { product } });
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/feedbacks`, feedbackForm);
      setSubmitMessage('Feedback submitted successfully! Awaiting approval.');
      setFeedbackForm({ name: '', review: '', star: 0 });
    } catch (err) {
      setSubmitMessage('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starValue) => {
    setFeedbackForm({ ...feedbackForm, star: starValue });
  };

  const handleToggleWishlist = (product) => {
    dispatch(wishlistActions.toggleWishlist(product));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const scrollFeedbacks = (direction) => {
    if (feedbackContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      feedbackContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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

      {/* Add preconnect hints in index.html for performance */}

      <div className="w-full relative">
        {/* Desktop Image */}
        <div className="hidden md:block relative">
          <img
            src={insertWidth("https://res.cloudinary.com/dxqz169dw/image/upload/v1753552936/home_pic_okqgxk_c_crop_ar_1_1_phc8j6.jpg", 2400)}
            width="1200"
            height="1200"
            fetchpriority="high"
            className="w-full h-auto object-cover aspect-square"
            alt="Traditional clothing"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-100">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center px-4 tracking-wider mb-4"
              style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
            >
              A legacy woven in tradition
            </h1>
            <a
              href="#products"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition text-sm md:text-base"
            >
              Explore More
            </a>
          </div>
        </div>

        {/* Mobile Image */}
        <div className="block md:hidden relative">
          <img
            src={insertWidth("https://res.cloudinary.com/dxqz169dw/image/upload/v1753550460/home_pic_okqgxk.jpg", 2400)}
            width="412"
            height="618"
            fetchpriority="high"
            className="w-full h-auto object-cover aspect-[2/3]"
            alt="Traditional clothing"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-60">
            <h1
              className="text-2xl font-bold text-white text-center px-4 tracking-wide mb-3"
              style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}
            >
              A legacy woven in tradition
            </h1>
            <a
              href="#products"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-full shadow-md transition text-sm"
            >
              Explore More
            </a>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div ref={categoryRef} className="w-full">
        {[
          {
            desktopImage: "https://res.cloudinary.com/dswff96z5/image/upload/v1752435544/IMG_8101_nxywzv.jpg",
            mobileImage: "https://res.cloudinary.com/dswff96z5/image/upload/v1752441769/IMG_8101_1_oej5lg.png",
            title: "kameez-shalwar",
            description: "Explore our exquisite Rivayat collection of traditional kameez shalwar sets",
            desktopWidth: 1200,
            desktopHeight: 900,
            mobileWidth: 532,
            mobileHeight: 946
          },
          {
            desktopImage: "https://res.cloudinary.com/dswff96z5/image/upload/v1752435545/IMG_8223_eezrpv.png",
            mobileImage: "https://res.cloudinary.com/dxqz169dw/image/upload/v1753556992/IMG_8113_fmkfip.jpg",
            title: "chappal",
            description: "Handcrafted footwear that combines comfort and tradition",
            desktopWidth: 1200,
            desktopHeight: 900,
            mobileWidth: 710,
            mobileHeight: 946
          },
          {
            desktopImage: "https://res.cloudinary.com/dxqz169dw/image/upload/v1753556680/assets_task_01k1410ahpewztcx0f0pm9bxw5_1753555894_img_1_o0tyug_c_crop_ar_4_3_tfrbfa.webp",
            mobileImage: "https://res.cloudinary.com/dxqz169dw/image/upload/v1753556626/assets_task_01k1410ahpewztcx0f0pm9bxw5_1753555894_img_1_o0tyug.webp",
            title: "Vardaans-Unstitched",
            description: "Create your own style with our premium unstitched fabrics",
            desktopWidth: 1200,
            desktopHeight: 900,
            mobileWidth: 631,
            mobileHeight: 946
          }
        ].map(({ desktopImage, mobileImage, title, description, desktopWidth, desktopHeight, mobileWidth, mobileHeight }, idx) => (
          <div
            key={idx}
            className="relative w-full min-h-[115vh] flex items-end justify-center overflow-hidden"
            style={{ aspectRatio: '4/3' }}
          >
            <img
              src={insertWidth(mobileImage, 2400)}
              width={mobileWidth}
              height={mobileHeight}
              alt={`${title} mobile`}
              className="block md:hidden absolute inset-0 w-full h-full object-cover object-center brightness-90"
              loading="lazy"
            />
            <img
              src={insertWidth(desktopImage, 2400)}
              width={desktopWidth}
              height={desktopHeight}
              alt={`${title} desktop`}
              className="hidden md:block absolute inset-0 w-full h-full object-cover object-center brightness-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full px-4 text-center z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2 capitalize"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-sm sm:text-base text-white mb-4"
              >
                {description}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/products/${encodeURIComponent(title)}`)}
                className="px-6 py-2 border border-white text-white font-medium rounded-full backdrop-blur-sm hover:bg-white/10 transition duration-300 text-sm"
              >
                Shop Now
              </motion.button>
            </div>
          </div>
        ))}
      </div>

      {/* All Products Section */}
      <div id="products" className="container mx-auto px-1 py-6 min-h-screen">
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
                  style={{ aspectRatio: '2/3' }}
                  onClick={() => {
                    if (product.stock > 0) handleProductClick(product);
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <img
                      src={insertWidth(product.imageUrl[0], 500)}
                      srcSet={`
                        ${insertWidth(product.imageUrl[0], 300)} 300w,
                        ${insertWidth(product.imageUrl[0], 500)} 500w,
                        ${insertWidth(product.imageUrl[0], 800)} 800w
                      `}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      width="174"
                      height="261"
                      alt={`${product.name} default`}
                      className="absolute w-full h-full object-cover transition-transform duration-500"
                      loading="lazy"
                    />
                    {product.imageUrl[1] && (
                      <img
                        src={insertWidth(product.imageUrl[1], 500)}
                        srcSet={`
                          ${insertWidth(product.imageUrl[1], 300)} 300w,
                          ${insertWidth(product.imageUrl[1], 500)} 500w,
                          ${insertWidth(product.imageUrl[1], 800)} 800w
                        `}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        width="174"
                        height="261"
                        alt={`${product.name} hover`}
                        className={`absolute w-full h-full object-cover translate-x-full ${product.stock > 0 ? 'group-hover:translate-x-0' : ''} transition-transform duration-500`}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWishlist(product);
                    }}
                    className="absolute top-1 right-1 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-100 transition-colors"
                    title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <svg
                      className={`w-5 h-5 transition-colors ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  {product.discountPercentage && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-semibold px-1 py-0.5 rounded shadow transform">
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
                        <span className="text-xs text-gray-400 line-through">Rs.{(Math.round(product.price)).toLocaleString()}</span>
                        <span className="text-sm font-bold text-red-600">
                          Rs.{Math.round(product.price * (1 - product.discountPercentage / 100)).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-gray-800">Rs.{(Math.round(product.price)).toLocaleString()}</span>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }}
                    className={`w-full py-2 rounded-md text-sm font-medium ${product.stock > 0
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

      {/* Recently Viewed Products Section */}
      <RecentlyViewedProducts />

      {/* Feedback Section */}
      <div id="feedback" className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-4 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center font-serif text-gray-800"
          >
            Customer Reviews
            <div className="w-20 h-1 bg-amber-500 mx-auto mt-2"></div>
          </motion.h2>
          <button
            onClick={() => navigate('/reviews')}
            className="px-5 py-2 rounded-full border border-amber-500 text-amber-600 hover:bg-amber-50 transition-colors text-sm"
          >
            View Reviews
          </button>
        </div>

        {feedbacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10"
          >
            <p className="text-lg text-gray-600">No reviews yet. Be the first to share your feedback!</p>
          </motion.div>
        ) : (
          <div className="relative">
            <motion.div
              ref={feedbackContainerRef}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="flex flex-row flex-nowrap overflow-x-auto scrollbar-hidden snap-x snap-mandatory gap-4"
            >
              {feedbacks.map((feedback) => (
                <motion.div
                  key={feedback._id}
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  className="flex-none w-1/2 sm:w-1/2 lg:w-1/4 snap-center bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 relative"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-400 text-white flex items-center justify-center text-lg font-bold">
                      {feedback.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{feedback.name}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < feedback.star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">"{feedback.review}"</p>
                  <div className="absolute bottom-4 right-4 text-yellow-300 text-4xl opacity-20">“</div>
                </motion.div>
              ))}
            </motion.div>
            {feedbacks.length > 4 && (
              <>
                <button
                  onClick={() => scrollFeedbacks('left')}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-amber-500 text-white rounded-full p-2 shadow-md hover:bg-amber-600 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollFeedbacks('right')}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-amber-500 text-white rounded-full p-2 shadow-md hover:bg-amber-600 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mt-20 mb-8 text-center font-serif text-gray-800"
        >
          Share Your Feedback
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-2"></div>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 mb-12"
        >
          <form onSubmit={handleFeedbackSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                id="review"
                value={feedbackForm.review}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, review: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="4"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className={`text-2xl ${feedbackForm.star >= star ? 'text-amber-500' : 'text-gray-300'} hover:text-amber-400 transition-colors duration-200`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                } transition-all duration-300`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </motion.button>
            {submitMessage && (
              <p className={`mt-3 text-sm text-center ${submitMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                {submitMessage}
              </p>
            )}
          </form>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}

export default Home;