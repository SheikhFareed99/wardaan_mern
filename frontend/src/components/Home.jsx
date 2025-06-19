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

   {/* Hero Section - Updated Responsive Solution */}
<div className="relative w-full">
  <div className="relative w-full min-h-[50vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[100vh]">
    <img
      className="absolute w-full h-full object-cover brightness-90"
      src="https://res.cloudinary.com/dswff96z5/image/upload/v1750154574/pexels-shvets-production-9775883_1_hofwuy.jpg"
      alt="main_pic"
      loading="eager"
    />
    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pt-[20vh] sm:pt-0">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
        Embrace the Legacy, Wear the Heritage
      </h1>
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-amber-50 mb-4 [text-shadow:_0_2px_6px_rgba(0,0,0,0.7)]">
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
</div>
   {/* Shop by Category Section */}
   <div ref={categoryRef} className="py-12 px-4 max-w-7xl mx-auto">
<div className="py-12 px-4 max-w-7xl mx-auto">
  <h1 className="text-3xl font-bold text-center mb-10">Shop by Category</h1>

  {/* Horizontally scrollable flex container */}
  <div className="flex gap-4 overflow-x-auto pb-4 whitespace-nowrap">
    
    {/* Reusable Card Component */}
    {[ 
  { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154573/OIP_jspxrv.webp", title: "kameez shalwar" },
  { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154572/OIP_1_oar9jt.webp", title: "chappal" },
  { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154572/download_d9wl5z.webp", title: "Wardaan Special" },
  { src: "https://res.cloudinary.com/dswff96z5/image/upload/v1750154572/OIP_1_gfgr8r.jpg", title: "Wardaan Unstitched" }
].map(({ src, title, contain }, idx) => (
  <div
  key={idx}
  onClick={() => navigate(`/products/${encodeURIComponent(title)}`)}
  className="cursor-pointer relative w-[270px] sm:w-[240px] md:w-[270px] h-[22rem] sm:h-[20rem] md:h-[24rem] rounded-xl overflow-hidden shadow-md group flex-shrink-0"
>
  <img
    src={src}
    alt={title}
    className={`w-full h-full ${
      contain ? "object-contain bg-white" : "object-cover object-top"
    } transition-transform duration-300 transform group-hover:scale-105`}
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
<video
  src="https://res.cloudinary.com/dswff96z5/video/upload/v1750154591/6766325-uhd_3840_2160_25fps_wlfxb2.mp4"
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