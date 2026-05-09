import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header.jsx';
import Footer from './footer.jsx';
import DraggableWhatsApp from './DraggableWhatsApp';
import axios from 'axios';

function Reviews() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/feedbacks`);
        const approvedFeedbacks = Array.isArray(response.data)
          ? response.data.filter((fb) => fb.status === true)
          : [];
        setFeedbacks(approvedFeedbacks);
      } catch (err) {
        setErrorMessage('Failed to load reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <>
      <Header />
      <DraggableWhatsApp />

      <div className="container mx-auto px-4 py-12 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-serif">Customer Reviews</h1>
              <div className="w-20 h-1 bg-amber-500 mt-2"></div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2 rounded-full border border-amber-500 text-amber-600 hover:bg-amber-50 transition-colors text-sm"
            >
              Back to Home
            </button>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-600 py-20">Loading reviews...</div>
          ) : errorMessage ? (
            <div className="text-center text-red-600 py-20">{errorMessage}</div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">:)</div>
              <p className="text-lg text-gray-600">No reviews yet. Be the first to share your feedback.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Write a Review
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-400 text-white flex items-center justify-center text-lg font-bold">
                      {feedback.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{feedback.name}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < feedback.star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">"{feedback.review}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Reviews;
