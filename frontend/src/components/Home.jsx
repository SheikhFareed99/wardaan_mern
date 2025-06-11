import Header from './header.jsx';
import Footer from './footer.jsx';
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const categoryRef = useRef(null);
  const navigate = useNavigate();
  return (
    <>
      {/* Announcement Bar */}
   
      <Header />

      {/* Hero Section */}
      <div className="relative w-full">
        <img
          className="w-full h-[100vh] object-cover brightness-90"
          src="/pictures/pexels-shvets-production-9775883 (1).jpg"
          alt="main_pic"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pt-[25%] sm:pt-0">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] filter drop-shadow-lg">
            Embrace the Legacy, Wear the Heritage
          </h1>
          <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-semibold text-amber-50 mb-4 [text-shadow:_0_2px_6px_rgba(0,0,0,0.7)] filter drop-shadow-md">
            Live the Timeless Elegance
          </h2>
          <button
        onClick={() => categoryRef.current?.scrollIntoView({ behavior: "smooth" })}
        className="mt-4 px-6 py-2 sm:px-8 sm:py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-base font-medium rounded-full shadow-lg transition duration-300"
      >
        Explore More
      </button>
        </div>
      </div>
   {/* Shop by Category Section */}
   <div ref={categoryRef} className="py-12 px-4 max-w-7xl mx-auto">
<div className="py-12 px-4 max-w-7xl mx-auto">
  <h1 className="text-3xl font-bold text-center mb-10">Shop by Category</h1>

  {/* Horizontally scrollable flex container */}
  <div className="flex gap-4 overflow-x-auto pb-4 whitespace-nowrap">
    
    {/* Reusable Card Component */}
    {[ 
  { src: "/pictures/men-shalwar-kameez-dark-brown-stylish-garments-pk-1.jpg", title: "kameez shalwar" },
  { src: "/pictures/OIP.jpg", title: "chappal" },
  { src: "/pictures/il_fullxfull.6326430442_6znz (1).avif", title: "Wardaan Special" },
  { src: "/pictures/OIP (1).jpg", title: "Wardaan Unstitched" }
].map(({ src, title, contain }, idx) => (
  <div
    key={idx}
    onClick={() => navigate(`/products/${encodeURIComponent(title)}`)}
    className="cursor-pointer relative min-w-[270px] h-[24rem] rounded-xl overflow-hidden shadow-md group flex-shrink-0"
  >
    <img
      src={src}
      alt={title}
      className={`w-full h-full ${
        contain ? "object-contain bg-white" : "object-cover object-top"
      } transform group-hover:scale-105 transition duration-300`}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    <h2 className="absolute bottom-3 left-3 text-white text-base font-bold drop-shadow-md">
      {title}
    </h2>
  </div>
))}
  </div>
</div>

<div className="w-full h-2 shadow-inner shadow-black/30"></div>
</div>
{/* Video Section */}
<div>
  <video src="/pictures/6766325-uhd_3840_2160_25fps.mp4" autoPlay loop muted className="w-full h-auto" />
</div>
      <Footer />
    </>
  );
}

export default Home;