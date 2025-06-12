import { useParams, useNavigate } from "react-router-dom";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import { useEffect, useState } from 'react';
import axios from 'axios';

function Products() 
{
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${category}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

     
  }, [category]);


  const handleProductClick = (product) => {
    console.log("product.ksx",product);
    navigate(`/ProductDescrition/${product.id}`, { state: { product } });

  };

  return (
    <>  
      <Header />
   
      <div className="container mx-auto px-1 py-8">
        {category && <h1 className="text-3xl font-bold mb-8 capitalize">{category}</h1>}
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {products.map(product => (
              <div 
                key={product.id} 
                className="bg-white shadow-md overflow-hidden relative hover:shadow-none transition-all duration-300 group"
                style={{
                  padding: '10px',
                  border: '2px solid transparent',
                  minWidth: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                {/* Image container */}
                <div 
                  className="relative pb-[140%] bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <img 
                    src={product.imageUrl[0]} 
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                </div>
                
                {/* Product info */}
                <div className="p-3">
                  <h3 className="text-sm sm:text-base font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {product.discountPercentage ? (
                      <>
                        <span className="text-xs sm:text-sm text-gray-500 line-through">PKR {product.price.toLocaleString()}</span>
                        <span className="text-xs sm:text-sm text-red-600 font-bold"> Rs.{(product.price * (1 - product.discountPercentage / 100)).toLocaleString()}</span>
                        <span className="bg-red-100 text-red-800 text-xs px-1 py-0.5 rounded">
                        {product.discountPercentage}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold">PKR {product.price.toLocaleString()}</span>
                    )}
                  </div>
                  
                  <button 
                    className={`w-full sm:w-3/4 mx-auto py-2 rounded-none text-xs sm:text-sm border border-black font-medium ${
                      product.stock > 0
                        ? 'bg-white text-black hover:bg-black hover:text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={product.stock <= 0}
                    onClick={() => handleProductClick(product)}
                  >
                    {product.stock > 0 ? 'ADD TO BAG' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
}

export default Products;
