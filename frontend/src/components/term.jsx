import Header from './header.jsx';
import Footer from './footer.jsx';
import { motion } from "framer-motion";

function Term() {
    const terms = [
        {
          title: "Product & Pricing",
          content: "All products are showcased as accurately as possible. Minor variations in color or stitching may occur due to screen differences or hand-finishing. Prices are listed in PKR and are subject to change without prior notice. Custom orders may be priced differently based on fabric, stitching, and detailing."
        },
        {
          title: "Order Process",
          content: "Orders are confirmed via WhatsApp, Instagram DM, or website (when available). Once confirmed, orders cannot be changed or cancelled. For custom orders, 50% advance payment is required."
        },
        {
          title: "Payment",
          content: "We accept payments via JazzCash, Easypaisa, bank transfer, and COD (Cash on Delivery) for selected regions. COD may involve a confirmation call or pre-booking amount. half payment must be made before dispatch for custom size shalwar kameez orders."
        },
        {
          title: "Delivery & Shipping",
          content: "Delivery charges are based on location and courier service. Standard delivery time is 3–5 business days for ready items. Customized orders may take 3–7 business days. Delays caused by courier services are not Vardaan's responsibility."
        },
        {
          title: "Returns & Exchanges",
          content: "We accept returns and refunds for standard (non-customized) products. To be eligible, the issue must be reported within 48 hours of receiving the order. The item must be unused, unwashed, and in its original packaging. 2-shipping costs(return and shipping) will be the customer’s responsibility unless the mistake is from our side. 🔸 No returns or refunds are accepted for: Customized orders (tailored sizing, design changes, or special requests). Items damaged due to mishandling after delivery.If their is no valid reason of returning the product their will be no return unless you satisfy our team about the reason you are returning.Refund will be issue after the returning product is received and checked "
        },
        {
          title: "Sizing & Customization",
          content: "Size charts are provided to ensure accurate selection. For stitched/custom orders, please ensure all measurements provided are correct. We are not responsible for size issues due to incorrect details."
        },
        {
          title: "Intellectual Property",
          content: "All content, designs, logos, and images on our pages are the property of Vardaan. Unauthorized use or reproduction is strictly prohibited."
        },
        {
          title: "Privacy",
          content: "Customer data (name, number, address) is collected only for order processing and delivery. We never share your personal information with third parties."
        },
        {
          title: "Changes to Terms",
          content: "Vardaan reserves the right to update these Terms & Conditions at any time without prior notice."
        }
      ];
      

  return (
    <>
      <Header />
      
      <div className="bg-amber-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-serif font-bold text-amber-800 mb-4">Terms & Conditions</h1>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-amber-700 italic">Last updated:26 June 2024</p>
            <p className="text-lg text-amber-900 mt-4">Welcome to Vardaan – Tradition, Tailored.</p>
            <p className="text-amber-800">By placing an order with Vardaan, you agree to the following Terms & Conditions. Please read them carefully before making a purchase.</p>
          </motion.div>

          {/* Terms List */}
          <div className="space-y-8">
            {terms.map((term, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500"
              >
                <h2 className="text-xl font-serif font-semibold text-amber-800 mb-3">{term.title}</h2>
                <p className="text-gray-700">{term.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 text-center bg-amber-100 p-8 rounded-lg border border-amber-200"
          >
            <h3 className="text-2xl font-serif font-semibold text-amber-800 mb-4">Contact Us</h3>
            <p className="text-amber-700 mb-6">If you have any questions regarding these Terms, you can reach out:</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a 
                href="https://instagram.com/vardaanswear" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
                Instagram
              </a>
              
              <a 
                href="https://wa.me/923028016744" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.05 4.91A9.816 9.816 0 0012.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 012.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.1-.23-.16-.48-.27z" clipRule="evenodd" />
                </svg>
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Term;