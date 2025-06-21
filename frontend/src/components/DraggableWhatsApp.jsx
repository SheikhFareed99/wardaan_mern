import { useState, useRef, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

function DraggableWhatsApp() {
  // Default to bottom-right
  const [position, setPosition] = useState({
    x: window.innerWidth - 80,
    y: window.innerHeight - 100,
  });

  const iconRef = useRef(null);
  const dragging = useRef(false);

  // Recalculate position on resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 70),
        y: Math.min(prev.y, window.innerHeight - 80),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e) => {
    dragging.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - dragging.current.x,
      y: e.clientY - dragging.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    dragging.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (!dragging.current) return;
    setPosition({
      x: touch.clientX - dragging.current.x,
      y: touch.clientY - dragging.current.y,
    });
  };

  const handleTouchEnd = () => {
    dragging.current = false;
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      ref={iconRef}
      className="fixed z-50 cursor-pointer"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <a
        href="https://wa.me/923036578904" // Replace with your number
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

export default DraggableWhatsApp;
