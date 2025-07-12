import Header from './header.jsx';
import Footer from './footer.jsx';
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DraggableWhatsApp from "./DraggableWhatsApp";
import axios from 'axios';
import { motion } from "framer-motion";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const categoryRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchdata = async () => {
      try {
        const response = await axios.get(`https://wardaan-mern.onrender.com/api/products/allproducts`);
        console.log(response.data);
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchdata();
  }, []);

  const handleProductClick = (product) => {
    if (product.stock > 0) {
      navigate(`/ProductDescrition/${product.id}`, { state: { product } });
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

      {/* Hero Section */}
      <div className="relative w-full">
        <div className="relative w-full min-h-[50vh] sm:min-h-[65vh] md:min-h-[75vh] lg:min-h-[100vh]">
          <img
            className="absolute w-full h-full object-cover brightness-90"
            src="https://res.cloudinary.com/dswff96z5/image/upload/v1752352295/WhatsApp_Image_2025-07-13_at_01.31.03_d2d97509_cg1g5w.jpg"
            alt="main_pic"
            loading="eager"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pt-[35vh] sm:pt-[40vh] md:pt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-yellow-800 mb-3 [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
              A Legacy Woven In Tradition
            </h1>
            <button
              onClick={() => categoryRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="mt-4 px-6 py-2 sm:px-8 sm:py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-base font-medium rounded-full shadow-lg transition duration-300"
            >
              Explore More
            </button>
          </div>
        </div>
      </div>

      {/* Shop by Category Section */}
      <div ref={categoryRef} className="py-12 px-4 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 capitalize text-center font-serif text-gray-800"
        >
          Shop by Category
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-2"></div>
        </motion.h1>

        <div className="flex gap-4 overflow-x-auto pb-4 whitespace-nowrap">
          {[
            { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154573/OIP_jspxrv.webp", title: "kameez-shalwar" },
            { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154572/OIP_1_oar9jt.webp", title: "chappal" },
            { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154572/download_d9wl5z.webp", title: "Vardaans-Special" },
            { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154572/OIP_1_gfgr8r.jpg", title: "Vardaans-Unstitched" }
          ].map(({ src, title }, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/products/${encodeURIComponent(title)}`)}
              className="cursor-pointer relative w-[270px] sm:w-[240px] md:w-[270px] h-[22rem] sm:h-[20rem] md:h-[24rem] rounded-xl overflow-hidden shadow-md group flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={src}
                alt={title}
                className="w-full h-full object-cover object-top transition-transform duration-500 transform group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h2 className="absolute bottom-3 left-3 text-white text-base font-bold drop-shadow-md">
                {title}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* All Products Section */}
      <div className="container mx-auto px-1 py-8 min-h-screen">
        {/* ... All products rendering stays unchanged ... */}
      </div>

      {/* Video Section */}
      <div className="mt-12 mb-12">
        <video
          src="https://res.cloudinary.com/dswff96z5/video/upload/v1752350520/WhatsApp_Video_2025-07-13_at_00.59.46_33e8ad1b_e7hgqh.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-auto object-cover"
        />
      </div>

      <Footer />
    </>
  );
}

export default Home;
