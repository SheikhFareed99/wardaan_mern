import AdminHeader from './AdminHeader';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function OrdersManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/adminLogin");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/orders?status=${filter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, filter]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleOrderUpdate = async (orderId, updatedFields) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, ...updatedFields } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-sm w-full max-w-4xl">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-8 bg-blue-400 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-center text-xl text-gray-600 mt-4">Loading Orders...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              View and manage all customer orders
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            <button 
              className={`px-4 py-2 rounded ${filter === "all" ? "bg-black text-white" : "bg-gray-200"}`} 
              onClick={() => setFilter("all")}
            >
              All Orders
            </button>
            <button 
              className={`px-4 py-2 rounded ${filter === "active" ? "bg-black text-white" : "bg-gray-200"}`} 
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button 
              className={`px-4 py-2 rounded ${filter === "cancelled" ? "bg-black text-white" : "bg-gray-200"}`} 
              onClick={() => setFilter("cancelled")}
            >
              Cancelled
            </button>
            <button 
              className={`px-4 py-2 rounded ${filter === "completed" ? "bg-black text-white" : "bg-gray-200"}`} 
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no orders matching the selected filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <>
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {order.address?.firstName?.charAt(0)}{order.address?.lastName?.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.address?.firstName} {order.address?.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.address?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.orderDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex -space-x-1">
                              {order.products.slice(0, 3).map((product, idx) => (
                                <div 
                                  key={idx}
                                  className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs"
                                  title={product.name}
                                >
                                  {product.name.charAt(0)}
                                </div>
                              ))}
                              {order.products.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                                  +{order.products.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Rs {order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => toggleOrderDetails(order._id)}
                              className={`mr-3 ${expandedOrder === order._id ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-900`}
                            >
                              {expandedOrder === order._id ? (
                                <>
                                  <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                  Hide
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                  Details
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedOrder === order._id && (
                          <tr>
                            <td colSpan="7" className="px-6 py-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b">Customer Information</h3>
                                  <div className="space-y-2">
                                    <div className="flex">
                                      <span className="text-sm font-medium text-gray-500 w-24">Name:</span>
                                      <span className="text-sm text-gray-900">{order.address?.firstName} {order.address?.lastName}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-sm font-medium text-gray-500 w-24">Email:</span>
                                      <span className="text-sm text-gray-900">{order.address?.email}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-sm font-medium text-gray-500 w-24">Phone:</span>
                                      <span className="text-sm text-gray-900">{order.address?.phone}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-sm font-medium text-gray-500 w-24">Address:</span>
                                      <span className="text-sm text-gray-900">
                                        {order.address?.address}, {order.address?.city}, {order.address?.country} - {order.address?.postalCode}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b">Order Settings</h3>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                      <select
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        value={order.status}
                                        onChange={(e) => handleOrderUpdate(order._id, { status: e.target.value })}
                                      >
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Status</label>
                                      <select
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        value={order.shippingStatus || "pending"}
                                        onChange={(e) => handleOrderUpdate(order._id, { shippingStatus: e.target.value })}
                                      >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                                      <input
                                        type="text"
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        value={order.trackingNumber || ""}
                                        onChange={(e) => handleOrderUpdate(order._id, { trackingNumber: e.target.value })}
                                        placeholder="Enter tracking number"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3 pb-2 border-b">Products</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {order.products.map((product, index) => (
                                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                      <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                                        {product.category === 'kameez shalwar' ? '👗' : 
                                         product.category === 'kurta' ? '👔' : '👕'}
                                      </div>
                                      <div className="ml-4">
                                        <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                                        <div className="mt-1 text-xs text-gray-500 space-y-1">
                                          <p>Size: {product.selectedSize}</p>
                                          <p>Qty: {product.quantity}</p>
                                          <p>Style: {product.style}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrdersManagement;