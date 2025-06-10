import { useState } from 'react';
import Footer from "./footer";
import Header from "./header";
import { useDispatch } from 'react-redux';
import { bagActions } from '../store/bagslice'; 
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
function ProductDescription() {
  const bagItems = useSelector((state) => state.bag.items);
  console.log("Bag size:", bagItems.length);
  const dispatch = useDispatch();
  const location = useLocation();
  const product = location.state?.product;
  console.log(bagItems);
    const navigate = useNavigate(); 



  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  // Generate delivery date range (3-5 days from today)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 3);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 5);

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });

  const deliveryRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="mb-4 border rounded-lg overflow-hidden">
              <img 
                src={product.imageUrl[selectedImage]} 
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto py-2">
            {product.imageUrl.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 border rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.brand}</h1>
            <h2 className="text-xl mb-4">{product.name}</h2>
            
            <div className="mb-6">
            <span className="text-2xl font-bold">
  Rs.{product.price.toLocaleString()}
</span>
<span className="text-lg text-gray-500 line-through ml-2">
  Rs.{(product.price / (1 - product.discountPercentage / 100)).toLocaleString()}
</span>
<span className="ml-2 text-green-600 font-medium">
  {product.discountPercentage}% OFF
</span>

            </div>
            
            <div className="mb-6">
              <span className={`px-2 py-1 rounded ${product.stock>0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock>0 ? 'In stock' : 'Out of stock'}
              </span>
              <p className="mt-2 text-sm">
                Delivery by <span className="font-medium">{deliveryRange}</span>
              </p>
            </div>
            {product.category === "kameez shalwar" && (
  <div className="mb-6">
    <h3 className="font-medium mb-2">Style:</h3>
    <div className="flex gap-2 flex-wrap">
      {product.styleOptions.map((style, index) => (
        <button
          key={style}
          onClick={() => setSelectedStyle(index)}
          className={`px-4 py-2 border rounded-md ${
            selectedStyle === index ? "bg-black text-white" : "bg-white"
          }`}
        >
          {style}
        </button>
      ))}
    </div>
  </div>
)}
            
            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">SIZE:</h3>
                <button 
                  onClick={() => setShowSizeChart(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Size Chart
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size, index) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(index)}
                    className={`w-12 h-12 flex items-center justify-center border rounded-md ${selectedSize === index ? 'bg-black text-white' : 'bg-white'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mb-4">
            <button 
  className="flex-1 py-3 border border-black bg-white text-black font-medium rounded-md hover:bg-gray-100"
  onClick={() => {
    const selectedProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      discount:product.discountPercentage,
      image: product.imageUrl[0],
      style:product.styleOptions[selectedStyle],
      selectedSize: product.sizes[selectedSize],
      bagid:bagItems.length
    };

    dispatch(bagActions.addItemToBag(selectedProduct));
  }}
>
  ADD TO CART
</button>


              <button className="flex-1 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800"
              onClick={()=> navigate("/CheckOut")}>
                BUY IT NOW
              </button>
            </div>

            {/* Toggle Product Description */}
            <div className="mb-6">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-left text-sm text-blue-700 underline"
              >
                {showDescription ? "Hide" : "Show"} Product Description
              </button>
              {showDescription && (
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  Elevate your wardrobe with this elegant ivory kurta trouser/shalwar set by Muraqsh. Designed for comfort and style, it blends traditional wear with a modern aesthetic. Made from premium fabric and stitched to perfection for any festive or formal occasion.
                </p>
              )}
            </div>

            {/* Shipping Policy */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Shipping policy</h3>
              <p className="text-sm text-gray-600">Standard delivery within 3–5 business days.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Size Chart Modal */}
      {showSizeChart && product.category==="kameez shalwar"&& (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">Size Chart</h3>
              <button 
                onClick={() => setShowSizeChart(false)}
                className="text-gray-500 hover:text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <img 
                src="/pictures/size_chart.png"
                alt="Size Chart"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default ProductDescription;
