import { useState } from 'react';
import Header from './header.jsx';
import Footer from './footer.jsx';

function CheckOut() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Novy Kurta Trouser/Shalwar - Men",
      style: "Ban / Shalwar / S",
      price: 5690.00,
      delivery: "Arrives by: Fri, 13 Jun - Mon, 16 Jun",
      image: "/pictures/il_fullxfull.6326430442_6znz.avif"
    },
    {
      id: 2,
      name: "Novy Kurta Trouser/Shalwar - Men",
      style: "Ban / Shalwar / S",
      price: 5690.00,
      delivery: "Arrives by: Fri, 13 Jun - Mon, 16 Jun",
      image: "/pictures/il_fullxfull.6326430442_6znz.avif"
    },
    {
      id: 3,
      name: "Novy Kurta Trouser/Shalwar - Men",
      style: "Ban / Shalwar / S",
      price: 5690.00,
      delivery: "Arrives by: Fri, 13 Jun - Mon, 16 Jun",
      image: "/pictures/il_fullxfull.6326430442_6znz.avif"
    }
  ]);

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
    shipping: 195.00
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const subtotal = products.reduce((sum, product) => sum + product.price, 0);
  const total = subtotal + formData.shipping;

  // Check if required fields (except email) are filled
  const isFormValid = () => {
    const { firstName, lastName, address, city, postalCode, phone } = formData;
    return firstName && lastName && address && city && postalCode && phone;
  };

  return (
    <>
      <Header />
      <main className="flex flex-col lg:flex-row max-w-7xl mx-auto min-h-screen">
        {/* Left side - slightly dull */}
        <div className="w-full lg:w-1/2 bg-gray-100 px-4 py-10">
          <div className="space-y-8 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

            <section className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded-lg mb-4" />
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="subscribe" checked={formData.subscribe} onChange={handleChange} />
                <span>Email me with news and offers</span>
              </label>
            </section>

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
                <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" className="p-3 border rounded-lg" />
              </div>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-3 border rounded-lg mt-4" />
            </section>
          </div>
        </div>

        {/* Right side - pure white */}
        <div className="w-full lg:w-1/2 bg-white py-10 px-4">
          <div className="bg-white p-6 rounded-xl shadow space-y-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {products.map(product => (
              <div key={product.id} className="flex items-start gap-4 border-b pb-4">
                <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium text-base">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.style}</p>
                  <p className="text-xs text-gray-400">{product.delivery}</p>
                </div>
                <button onClick={() => removeProduct(product.id)} className="text-red-500 text-lg font-bold">×</button>
              </div>
            ))}

            <div>
              <input name="discountCode" value={formData.discountCode} onChange={handleChange} placeholder="Discount code" className="w-full p-3 border rounded-lg mb-3" />
              <button className="w-full bg-green-300 hover:bg-green-100 text-sm font-medium py-2 rounded-lg">Apply</button>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs {formData.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Payment</h3>
              <label className="flex items-center gap-2 p-3 border rounded-lg">
                <input type="radio" name="paymentMethod" value="cashOnDelivery" checked readOnly />
                <span>Cash on Delivery</span>
              </label>
            </div>

            <button
              className={`w-full py-3 rounded-lg text-sm font-semibold transition ${
                isFormValid()
                  ? "bg-red-500 text-white hover:bg-red-800"
                  : "bg-black text-white hover:bg-gray-800 cursor-not-allowed"
              }`}
              disabled={!isFormValid()}
            >
              Complete Order
            </button>

            {!isFormValid()  && (
  <p className="font-semibold text-red-500 mt-2">
    *Please fill all fields
  </p>
)}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CheckOut;
