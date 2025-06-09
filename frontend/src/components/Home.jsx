import Header from './header.jsx';
import Footer from './footer.jsx';

function Home() {
  return (
    <>
      <Header />
      <div className="relative w-full">
  {/* Image Background */}
  <img
    className="w-full h-[100vh] object-cover brightness-90"
    src="/pictures/pexels-shvets-production-9775883 (1).jpg"
    alt="main_pic"
  />

  {/* Text Overlay with Responsive Styling */}
  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pt-[25%] sm:pt-0">

    {/* Main Heading */}
    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3
                   [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] filter drop-shadow-lg">
      Embrace the Legacy, Wear the Heritage
    </h1>

    {/* Subheading */}
    <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-semibold text-amber-50 mb-4
                   [text-shadow:_0_2px_6px_rgba(0,0,0,0.7)] filter drop-shadow-md">
      Live the Timeless Elegance
    </h2>

    {/* CTA Button */}
    <button className="mt-4 px-6 py-2 sm:px-8 sm:py-3 bg-amber-600 hover:bg-amber-700 
                      text-white text-sm sm:text-base font-medium rounded-full shadow-lg 
                      transition duration-300">
      Explore Menu
    </button>
  </div>
</div>
      <Footer />
    </>
  );
}

export default Home;