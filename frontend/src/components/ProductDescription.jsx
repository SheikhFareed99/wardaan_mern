import { useState, useEffect } from 'react';
import Footer from "./footer";
import Header from "./header";
import { useDispatch, useSelector } from 'react-redux';
import { bagActions } from '../store/bagslice'; 
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DraggableWhatsApp from "./DraggableWhatsApp";
import axios from 'axios';

function ProductDescription() {
  const { id } = useParams();
  const category=localStorage.getItem("category")
  const [product, setProduct] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(id)
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        console.log(id)
        const response = await axios.get(`https://wardaan-mern.onrender.com/api/products/selectedproduct/${id}`);
        setProduct(response.data);
       
     
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const bagItems = useSelector((state) => state.bag.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State management
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  function transformCloudinaryUrl(url, width) {
    if (!url) return '';
    const [prefix, suffix] = url.split("/upload/");
    return `${prefix}/upload/w_${width},f_auto,q_auto/${suffix}`;
  }

  const getSelectedProduct = () => {
    const isUnstitchedKameezShalwar = 
      product.category === "kameez shalwar" && category === "Vardaans-Unstitched";
  
    const productObject = {
      id: product._id,
      category: product.category,
      name: product.name,
      brand: product.brand,
      price: isUnstitchedKameezShalwar 
        ? product.price - 1215
        : product.price,
      discount: product.discountPercentage,
      image: product.imageUrl[0],
      bagid: bagItems.length,
    };
  
    if (!isUnstitchedKameezShalwar) {
      productObject.selectedSize = product.sizes[selectedSize];
      productObject.style = product.styleOptions[selectedStyle];
    } else {
      productObject.selectedSize = "nill";
      productObject.style = "nill";
    }
  
    return productObject;
  };

  const handleAddToCart = () => {
    const selectedProduct = getSelectedProduct();
    dispatch(bagActions.addItemToBag(selectedProduct));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1000);
  };

  const handleBuyNow = () => {
    const selectedProduct = getSelectedProduct();
    dispatch(bagActions.addItemToBag(selectedProduct));
    navigate("/CheckOut");
  };

  // Delivery date calculation
  const today = new Date();
  const deliveryRange = `${new Date(today.setDate(today.getDate() + 5)).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} - ${new Date(today.setDate(today.getDate() + 3)).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image loader */}
            <div>
              <div className="mb-4 h-[500px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl animate-pulse"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Content loader */}
            <div className="space-y-6">
              <div className="h-8 w-3/4 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-1/2 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-1/3 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/4 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse"></div>
              <div className="h-12 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse"></div>
              <div className="h-12 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error loading product</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <DraggableWhatsApp />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-7xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative aspect-[2.5/4] bg-gray-50 rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src={transformCloudinaryUrl(product.imageUrl[selectedImage], 1800)} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              
              {product.discountPercentage > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg"
                >
                  {product.discountPercentage}% OFF
                </motion.div>
              )}
              
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="flex gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                  {product.imageUrl.map((img, index) => (
                    <motion.button 
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`w-15 h-19 rounded-full overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-amber-500 scale-110 shadow-md' 
                          : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <img 
                        loading="lazy"
                        src={transformCloudinaryUrl(img, 500)} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Product Details */}
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
          >
            <div className="mb-6">
              <span className="text-sm font-medium text-amber-600">{product.brand}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3">{product.name}</h1>
              {(product.category === "kameez shalwar" && category!=="Vardaans-Unstitched")||(product.category === "chappal") ? (
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-extrabold text-gray-900">
                    Rs.{Math.round(product.price * (1 - product.discountPercentage / 100)).toLocaleString()}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-lg text-gray-500 line-through">
                      Rs.{(Math.round(product.price).toLocaleString())}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-extrabold text-gray-900">
                    Rs.{Math.round((product.price-1215) * (1 - product.discountPercentage / 100)).toLocaleString()}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-lg text-gray-500 line-through">
                      Rs.{(Math.round(product.price-1215)).toLocaleString()}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? product.stock + ' In Stock' : 'Out of Stock'}
                </span>
                <div className="flex items-center gap-1 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Delivery by {deliveryRange}</span>
                </div>
              </div>
            </div>

            {/* Style Options */}
            {product.category === "kameez shalwar" && category!=="Vardaans-Unstitched" && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 mb-3">SELECT STYLE</h3>
                <div className="flex flex-wrap gap-2">
                  {product.styleOptions.map((style, index) => (
                    <motion.button
                      key={style}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedStyle(index)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedStyle === index
                          ? "bg-amber-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {style}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {category!=="Vardaans-Unstitched" && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-500">SELECT SIZE</h3>
                  {product.category === "kameez shalwar" && (
                    <button 
                      onClick={() => setShowSizeChart(true)}
                      className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      SIZE GUIDE
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size, index) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(index)}
                      className={`aspect-square flex items-center justify-center rounded-lg font-medium transition-all ${
                        selectedSize === index
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            
            {product.category==="kameez shalwar" && category!=="Vardaans-Unstitched" && (
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100 text-center">
                <p className="text-amber-700 font-medium">
                  For custom-sized shalwar kameez, please contact us via WhatsApp.
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  We'll be happy to create a perfect fit just for you.
                </p>
              </div>
            )}
            {/* Fitting Info */}
{product.category === "kameez shalwar" && category !== "Vardaans-Unstitched" && product.fitting && (
  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm font-medium my-5">
    <span className="text-amber-600 font-semibold block mb-1">Fitting:</span>
    {product.fitting}
  </div>
)}

            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    ADDED TO BAG
                  </span>
                ) : (
                  <span>ADD TO BAG</span>
                )}
              </motion.button>

              <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold text-lg rounded-xl hover:from-amber-500 hover:to-amber-600 shadow-md"
                onClick={handleBuyNow}
              >
                BUY NOW
              </motion.button>
            </div>

            {/* Product Details */}
{/* Product Details */}
<div className="border-t border-gray-100 pt-6">
  <span className="text-lg font-bold text-amber-600">PRODUCT DETAILS</span>
  <p className="mt-4 text-gray-700 leading-relaxed font-medium">
    {product.description}
  </p>
  
  {/* More Information Section - Collapsible */}
  <div className="mt-6">
    <motion.div
      initial={false}
      animate={{ 
        backgroundColor: showMoreInfo ? 'rgba(253, 230, 138, 0.1)' : 'transparent'
      }}
      className="rounded-xl p-1"
    >
      <button 
        onClick={() => setShowMoreInfo(!showMoreInfo)}
        className="w-full flex justify-between items-center py-3 px-2 focus:outline-none"
      >
        <h3 className="text-lg font-bold text-amber-600">MORE INFORMATION</h3>
        <motion.div
          animate={{ rotate: showMoreInfo ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-amber-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </button>
    </motion.div>

    <AnimatePresence>
      {showMoreInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          
          <div className="grid grid-cols-1 gap-4 py-4 px-2">
            {/* Single column layout - one item per row */}
            <div className="flex items-start border-b border-gray-100 pb-3">
              <span className="font-medium text-gray-700 w-40 flex-shrink-0">Color</span>
              <span className="text-gray-600 font-medium">{product.color || 'Brown'}</span>
            </div>
            
            <div className="flex items-start border-b border-gray-100 pb-3">
              <span className="font-medium text-gray-700 w-40 flex-shrink-0">Fabric</span>
              <span className="text-gray-600 font-medium">{product.fabric || 'Blended'}</span>
            </div>
            
            <div className="flex items-start border-b border-gray-100 pb-3">
              <span className="font-medium text-gray-700 w-40 flex-shrink-0">Product Category</span>
              <span className="text-gray-600 font-medium">{product.category || 'Casual Kameez Shalwar'}</span>
            </div>
            
            <div className="flex items-start border-b border-gray-100 pb-3">
              <span className="font-medium text-gray-700 w-40 flex-shrink-0">Season</span>
              <span className="text-gray-600 font-medium">{product.season || 'All Seasons'}</span>
            </div>
            
            <div className="flex items-start">
              <span className="font-medium text-gray-700 w-40 flex-shrink-0">Disclaimer</span>
              <span className="text-gray-500 text-sm italic">
                {product.disclaimer || 'Due to photographic lighting & screen differences, colors may vary slightly'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</div>
          </motion.div>
        </div>
      </motion.main>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {showSizeChart && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900">Size Guide (in inches)</h3>
                <button 
                  onClick={() => setShowSizeChart(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-y-auto p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">SIZE</th>
                        <th className="px-4 py-3 text-left font-medium">CHEST (ONE SIDE)</th>
                        <th className="px-4 py-3 text-left font-medium">SHOULDERS</th>
                        <th className="px-4 py-3 text-left font-medium">LENGTH</th>
                        <th className="px-4 py-3 text-left font-medium">SLEEVES</th>
                        <th className="px-4 py-3 text-left font-medium">COLLAR</th>
                        <th className="px-4 py-3 text-left font-medium">SHALWAR LENGTH</th>
                        <th className="px-4 py-3 text-left font-medium">PAJAMA LENGTH</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { size: 'XS', chest: 22, shoulders: 17, length: 39.5, sleeves: 23, collar: 14.5, shalwar: 39, pajama: 39 },
                        { size: 'S', chest: 23, shoulders: 17.5, length: 40.75, sleeves: 23.5, collar: 15, shalwar: 40, pajama: 40 },
                        { size: 'M', chest: 24, shoulders: 18.5, length: 42.25, sleeves: 24.25, collar: 16, shalwar: 42, pajama: 42 },
                        { size: 'L', chest: 25, shoulders: 19.5, length: 44, sleeves: 25, collar: 17, shalwar: 44, pajama: 44 },
                        { size: 'XL', chest: 27, shoulders: 20.5, length: 45.25, sleeves: 25.5, collar: 18, shalwar: 45, pajama: 45 },
                        { size: 'XXL', chest: 28.5, shoulders: 21.5, length: 46.5, sleeves: 26, collar: 18.5, shalwar: 46, pajama: 46 }
                      ].map((row) => (
                        <tr key={row.size} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{row.size}</td>
                          <td className="px-4 py-3">{row.chest}</td>
                          <td className="px-4 py-3">{row.shoulders}</td>
                          <td className="px-4 py-3">{row.length}</td>
                          <td className="px-4 py-3">{row.sleeves}</td>
                          <td className="px-4 py-3">{row.collar}</td>
                          <td className="px-4 py-3">{row.shalwar}</td>
                          <td className="px-4 py-3">{row.pajama}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3">HOW TO MEASURE</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>Chest: Measure across the chest from one side to the other</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>Shoulders: Measure from shoulder seam to shoulder seam</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>Length: Measure from shoulder to bottom hem</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">FITTING TIPS</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>For traditional fit, choose your regular size</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>For slim fit, consider sizing up</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>All measurements are in inches</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <button 
                  onClick={() => setShowSizeChart(false)}
                  className="w-full py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
                >
                  CLOSE SIZE GUIDE
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

export default ProductDescription;