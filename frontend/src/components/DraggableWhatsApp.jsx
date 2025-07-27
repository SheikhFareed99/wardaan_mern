import { FaWhatsapp } from "react-icons/fa";

function WhatsAppFixed() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://wa.me/923028016744"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-12 h-12 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-2xl sm:text-3xl" />
      </a>
    </div>
  );
}

export default WhatsAppFixed;
