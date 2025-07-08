import { useEffect } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Checkmark */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="text-green-500 w-16 h-16" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Order Confirmed!Your order Id is {orderId}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for shopping with us. Your order has been received.
          </p>

          {/* Contact Options */}
          <div className="max-w-lg mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a 
                href="https://wa.me/923036578904" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-50 hover:bg-green-100 rounded-lg p-4 transition flex flex-col items-center"
              >
                <svg 
                  className="text-green-500 w-6 h-6 mb-2" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-3.428c-.545 1.492-1.578 2.783-2.887 3.202-.208.066-.371.082-.495.041-.124-.041-.223-.174-.347-.289-.124-.116-.446-.446-.535-.594-.089-.149-.01-.289.025-.347.036-.058.089-.14.133-.223.043-.083.058-.14.089-.223.03-.082.015-.149 0-.174-.017-.025-.074-.066-.173-.091-.099-.025-.186-.05-.26-.075-.074-.025-.148-.066-.223-.082-.074-.017-.148-.034-.198-.108-.05-.074-.038-.174-.018-.273.02-.099.074-.272.124-.416l.083-.198c.058-.14.074-.248.074-.347 0-.099-.025-.149-.074-.198-.05-.05-.124-.074-.223-.074-.099 0-.223.041-.347.132-.124.091-.322.264-.47.446-.148.181-.314.388-.423.496-.109.107-.223.215-.347.248-.124.033-.248.017-.347-.016-.099-.033-.223-.116-.347-.256s-.297-.314-.396-.446c-.1-.132-.173-.215-.248-.215-.074 0-.148.033-.223.05l-.744.248c-.248.083-.409.124-.52.182-.112.058-.173.091-.223.173s-.074.165-.05.264c.024.099.074.198.198.314.124.116.545.529 1.167.868.622.34 1.154.512 1.554.595.198.041.372.041.52-.025.148-.066.297-.198.446-.347.149-.149.297-.289.409-.388.111-.099.223-.165.322-.165.099 0 .198.074.297.223.099.149.198.314.26.413.063.099.136.181.223.256.087.074.186.123.26.123.074 0 .136-.016.186-.058.05-.041.099-.107.136-.198.037-.091.037-.165.037-.223 0-.058-.02-.107-.037-.124z"/>
                </svg>
                <span className="font-medium">WhatsApp</span>
                <span className="text-sm text-gray-500">Instant Support</span>
              </a>
              <a 
                href="mailto:vardaansofficial@gmail.com" 
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-4 transition flex flex-col items-center"
              >
                <svg 
                  className="text-blue-500 w-6 h-6 mb-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <span className="font-medium">Email Us</span>
                <span className="text-sm text-gray-500">vardaansofficial@gmail.com</span>
              </a>
              <div className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 transition flex flex-col items-center">
                <svg 
                  className="text-purple-500 w-6 h-6 mb-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span className="font-medium">Call Us</span>
                <span className="text-sm text-gray-500">+92 303 6578904</span>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-12">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-black rounded-lg font-medium hover:bg-black hover:text-white transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;