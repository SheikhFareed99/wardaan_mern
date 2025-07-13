import { motion } from "framer-motion";
import { FaSpinner, FaShoppingBag, FaInstagram, FaWhatsapp } from "react-icons/fa";

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center p-8 text-center">
      {/* Animated Logo/Title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-amber-800 font-serif mb-2">
          vardaanswear
        </h1>
        <div className="w-32 h-1 bg-amber-600 mx-auto"></div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-2xl"
      >
        <div className="relative mb-12">
          <FaShoppingBag className="text-6xl md:text-8xl text-amber-700 opacity-20 absolute -top-6 -left-6" />
          <FaShoppingBag className="text-6xl md:text-8xl text-amber-700 opacity-20 absolute -bottom-6 -right-6" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-amber-900 mb-6">
              We are <span className="text-amber-600">Coming Soon</span>
            </h2>
            <p className="text-lg md:text-xl text-amber-800 mb-8">
              We're crafting an exceptional shopping experience for you. 
              Our artisans are putting the final touches to our collection.
            </p>
          </div>
        </div>

        {/* Animated Countdown/Progress */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 2, ease: "easeInOut" }}
          className="bg-amber-200 h-2 rounded-full mb-12 overflow-hidden"
        >
          <div className="bg-amber-600 h-full w-full origin-left"></div>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-amber-700 mb-8 flex justify-center"
        >
          <FaSpinner className="text-4xl" />
        </motion.div>

        <p className="text-amber-700 mb-8 text-lg italic">
          "Fashion is the armor to survive the reality of everyday life."<br />
          - Bill Cunningham
        </p>

        {/* Contact Info */}
        <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-amber-200">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">
            Stay Connected
          </h3>
          <p className="text-amber-700 mb-4">
            Follow us for updates and previews of our collection
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-amber-700 hover:text-amber-900 transition">
              <FaInstagram className="text-2xl" />
            </a>
            <a href="#" className="text-amber-700 hover:text-amber-900 transition">
              <FaWhatsapp className="text-2xl" />
            </a>
          </div>
          <p className="mt-4 text-sm text-amber-600">
           +92 30345723001
          </p>
        </div>

        {/* Signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-amber-700 font-serif italic"
        >
          With love, The Wardaan Team
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ComingSoonPage;