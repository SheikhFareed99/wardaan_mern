import axios from 'axios';
import { useState } from 'react';
import Header from './header.jsx';
import Footer from './footer.jsx'

function OrderTrack() {
    const [orderid, setorderid] = useState("");
    const [trackingid, settrackingid] = useState("");
    const [status, setstatus] = useState("");

    const fetchStatus = async () => {
        try {
            const response = await axios.get(`https://wardaan-mern.onrender.com/api/orders/orderid/:status=${orderid}`);
            setstatus(response.data.status);
            settrackingid(response.data.trackingid);
        } catch (err) {
            console.error("Error occurred:", err.message);
        }
    };

    return (
        <>
        <Header/>
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-2xl rounded-xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Track Your Order</h1>
                
                <label className="block text-gray-700 font-semibold mb-2 text-lg">Order ID</label>
                <input
                    type="text"
                    placeholder="Enter your order ID"
                    className="w-full p-3 mb-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none"
                    onChange={(e) => setorderid(e.target.value)}
                    value={orderid}
                />

                <button
                    onClick={fetchStatus}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition duration-200"
                >
                    Check Status
                </button>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Order Status: <span className="text-green-700">{status || 'Not yet checked'}</span>
                    </h2>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Tracking ID: <span className="text-green-700">{trackingid || 'Not yet available'}</span>
                    </h2>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
}

export default OrderTrack;
