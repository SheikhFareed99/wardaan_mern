import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 ring-1 ring-white/10 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:bottom-6 sm:left-6"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          Top
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default BackToTopButton;
