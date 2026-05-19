import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bagActions } from '../store/bagslice'; 
import Header from './header.jsx';
import Footer from './footer.jsx';
import { useNavigate } from 'react-router-dom';
import DraggableWhatsApp from "./DraggableWhatsApp";
import { AnimatePresence, motion } from 'framer-motion';

function CheckOut() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof fbq !== "undefined") {
      fbq('track', 'InitiateCheckout', {  
        value: subtotal.toFixed(0),
        currency: 'PKR'
      });
    }
  }, []);

  const bagArr = useSelector((state) => state.bag.items);
  const id = useSelector((state) => state.user.customerId);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    subscribe: true,
    country: 'Pakistan',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: '',
    discountCode: '',
    shipping:249,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountcode, setDiscountcode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const subtotal = bagArr.reduce(
    (sum, item) =>
      sum + item.price * (1 - item.discount / 100) * item.quantity,
    0
  );

  const discountAmount = discount > 0 ? (subtotal * discount / 100) : 0;
  const total = (subtotal - discountAmount) + formData.shipping;
  const quantityAnimationVariants = {
    initial: { opacity: 0, y: -8, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.96 },
  };

  const isFormValid = () => {
    const { firstName, lastName, address, city, phone } = formData;
    return firstName && lastName && address && city && phone;
  };
  
  const insertWidth = (url, width) => {
    if (!url) return '';
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return url;
    const prefix = url.slice(0, uploadIndex + 8); // includes '/upload/'
    const suffix = url.slice(uploadIndex + 8);

    return `${prefix}w_${width},f_auto,q_auto/${suffix}`;
  };

  const getDeliveryDate = () => {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 3);
    return delivery.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const applyDiscount = async () => {
    if (!formData.discountCode) {
      alert('Please enter a discount code');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/DiscountCode/${formData.discountCode}`);
      if (!response.ok) {
        throw new Error('Invalid discount code');
      }
      const data = await response.json();
      setDiscount(data.amount);
      setDiscountcode(data.code);
      setDiscountApplied(true);
  
    } catch (error) {
      alert(error.message);
      setDiscount(0);
      setDiscountApplied(false);
    }
  };

  const removeDiscount = () => {
    setDiscount(0);
    setDiscountApplied(false);
    setFormData(prev => ({...prev, discountCode: ''}));
  };

  const handleSubmit = async () => {
    if (!isFormValid() || bagArr.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: id && id !== '0' ? id : null,
          products: bagArr.map((item) => ({
            id: item.id,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            category: item.category,
            style: item.category !== 'chappal' ? item.style : undefined,
          })),
          shipping: formData.shipping,
          address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            apartment: formData.apartment,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode,
          },
          discountCode: discountApplied ? formData.discountCode : undefined,
          discountAmount: discountAmount,
          totalAmount: total,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('Order placed successfully!');
        dispatch(bagActions.clearBag());
        navigate('/OrderConfirmation', { state: { orderId: data.orderId } });
      } else {
        alert(data.message || 'Order failed!');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = () => {
    if (!isFormValid() || bagArr.length === 0 || loading) return;
    setShowReviewModal(true);
  };

  const confirmPlaceOrder = async () => {
    setShowReviewModal(false);
    await handleSubmit();
  };

  return (
    <>
      <Header />
      <DraggableWhatsApp />
      <main className="flex flex-col lg:flex-row max-w-7xl mx-auto min-h-screen">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 bg-gray-100 px-4 py-10">
          <div className="space-y-8 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

            {/* Contact Info */}
            <section className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded-lg mb-4" />
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="subscribe" checked={formData.subscribe} onChange={handleChange} />
                <span>Email me with news and offers</span>
              </label>
            </section>

            {/* Address */}
            <section className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <select name="country" value={formData.country} onChange={handleChange} className="w-full p-3 border rounded-lg mb-4">
                <option value="Pakistan">Pakistan</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="p-3 border rounded-lg" />
                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="p-3 border rounded-lg" />
              </div>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-3 border rounded-lg mt-4" />
              <input name="apartment" value={formData.apartment} onChange={handleChange} placeholder="Apartment, suite, etc. (optional)" className="w-full p-3 border rounded-lg mt-4" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="p-3 border rounded-lg" />
                <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code(optional)" className="p-3 border rounded-lg" />
              </div>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-3 border rounded-lg mt-4" />
            </section>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 bg-white py-10 px-4">
          <div className="bg-white p-6 rounded-xl shadow space-y-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
            {bagArr.map((item) => (
              <div key={item.id} className="flex items-start gap-4 border-b pb-4">
                <img src={insertWidth(item.image, 500)}
                      srcSet={`
                        ${insertWidth(  item.image, 500)} 500w,
                        ${insertWidth(  item.image, 1000)} 500w,
                        ${insertWidth(  item.image, 1600)} 500w
                      `}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      alt={item.name} className="w-18 h-27 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium text-base">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.category !== 'chappal' ? item.style + ' / ' : ''}
                    Size: {item.selectedSize}
                  </p>
                  <p className="text-xs text-gray-400">Arrives by: {getDeliveryDate()}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <span className="text-gray-600">Qty:</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={item.quantity}
                        variants={quantityAnimationVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-900 px-2.5 py-0.5 text-white shadow-sm"
                      >
                        {item.quantity}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="mt-2 space-y-1 text-sm">
                    {item.discount > 0 ? (
                      <>
                        <p>
                          <span className="line-through text-gray-500">
                            Rs {item.price.toLocaleString()}
                          </span>{" "}
                          <span className="text-red-600 font-semibold">
                            Rs {(Math.round(item.price * (1 - item.discount / 100))).toLocaleString()}
                          </span>
                        </p>
                        <span className="inline-block bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded">
                          {item.discount}% OFF
                        </span>
                        <p className="text-xs text-gray-700 font-medium">
                          Total: Rs {Math.round(item.price * (1 - item.discount / 100) * item.quantity).toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="font-medium text-black">
                        Rs {Math.round(item.price * item.quantity).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    dispatch(bagActions.removeEntireItemFromBag({ bagid: item.bagid }))
                  }
                  className="text-red-500 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Discount Code */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  name="discountCode"
                  value={formData.discountCode}
                  onChange={handleChange}
                  placeholder="Discount code"
                  className="flex-1 p-3 border rounded-lg"
                  disabled={discountApplied}
                />
                {!discountApplied ? (
                  <button
                    onClick={applyDiscount}
                    className="bg-black text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
                  >
                    Apply
                  </button>
                ) : (
                  <button
                    onClick={removeDiscount}
                    className="bg-red-500 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
              {discountApplied && (
                <p className="text-green-600 text-sm">Discount of {discount}% applied successfully!</p>
              )}
            </div>

            {/* Totals and Payment */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <motion.span
                  key={subtotal.toFixed(0)}
                  initial={{ opacity: 0.6, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Rs {subtotal.toFixed(0)}
                </motion.span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>- Rs {discountAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs {formData.shipping.toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <motion.span
                  key={total.toFixed(0)}
                  initial={{ opacity: 0.6, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Rs {total.toFixed(0)}
                </motion.span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Payment</h3>
              <label className="flex items-center gap-2 p-3 border rounded-lg">
                <input type="radio" name="paymentMethod" value="cashOnDelivery" checked readOnly />
                <span>Cash on Delivery</span>
              </label>
            </div>

            {/* Return and Refund Policy Section */}
            <div className="flex items-center gap-1 text-gray-600 mt-4 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span className="text-sm text-black">Easy Returns & Refunds within 7 Days</span>
            </div>

            <button
              onClick={openReviewModal}
              disabled={!isFormValid() || bagArr.length === 0 || loading}
              className={`w-full h-15 py-3 rounded-lg text-sm font-semibold transition ${
                isFormValid() && bagArr.length > 0 && !loading
                  ? 'bg-red-500 text-white hover:bg-red-800'
                  : 'bg-green-500 text-white hover:bg-gray-800 cursor-not-allowed'
              }`}
            >
              {loading ? 'Preparing...' : 'Review Order'}
            </button>

            {successMsg && (
              <p className="text-green-600 font-semibold mt-3">{successMsg}</p>
            )}

            {!isFormValid() && (
              <p className="font-semibold text-red-500 mt-2">*Please fill all fields</p>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between border-b px-6 py-4 sm:px-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
                  <p className="text-sm text-gray-500">Check everything once before placing the order.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Close order review"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto px-6 py-5 sm:px-8">
                <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
                  <div className="space-y-4">
                    {bagArr.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <img
                          src={insertWidth(item.image, 400)}
                          alt={item.name}
                          className="h-24 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.category !== 'chappal' ? item.style + ' / ' : ''}
                            Size: {item.selectedSize}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Qty</span>
                            <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-semibold text-white">{item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Line total</p>
                          <p className="font-semibold text-gray-900">
                            Rs {Math.round(item.price * (1 - item.discount / 100) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium text-gray-900">Rs {subtotal.toFixed(0)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex items-center justify-between text-green-600">
                          <span>Discount ({discount}%)</span>
                          <span>- Rs {discountAmount.toFixed(0)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span className="font-medium text-gray-900">Rs {formData.shipping.toFixed(0)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3 text-base font-bold text-gray-900">
                        <span>Total</span>
                        <span>Rs {total.toFixed(0)}</span>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                      Payment method: Cash on Delivery
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setShowReviewModal(false)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={confirmPlaceOrder}
                        disabled={loading}
                        className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        {loading ? 'Placing Order...' : 'Place Order'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default CheckOut;