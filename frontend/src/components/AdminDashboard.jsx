import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import axios from "axios";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminLogin");
      return;
    }

    const statusValue = "active";

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders?status=${statusValue}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched orders:", data);
      setOrders(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const orderCount = orders.length;
  const pendingShipmentCount = orders.filter(
    (order) => order.shippingStatus === "pending"
  ).length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleString()
    : "Not updated yet";

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
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
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

      console.log("Order updated successfully!");
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order");
    }
  };

  if (loading) {
    return (
      <div className="admin-shell admin-bg flex min-h-screen items-center justify-center px-4">
        <div className="admin-card w-full max-w-4xl rounded-3xl p-8 text-center">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-8 rounded-full bg-emerald-400"></div>
            </div>
          </div>
          <h1 className="admin-title mt-4 text-xl text-slate-600">Loading Dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell admin-bg min-h-screen">
      <AdminHeader />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 admin-animate">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="admin-title text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Track active orders and shipping status at a glance.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/OrdersOverview")}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5"
                >
                  Orders Overview
                </button>
                <button
                  onClick={() => {
                    setIsRefreshing(true);
                    fetchOrders();
                  }}
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
                <button
                  onClick={() => navigate("/FinanceSummary")}
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Finance Summary
                </button>
                <button
                  onClick={() => navigate("/AdminReports")}
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Reports
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Last updated: {lastUpdatedLabel}
            </p>

            <div className="admin-stagger mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="admin-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Active orders</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{orderCount}</p>
                <p className="mt-1 text-sm text-slate-500">Currently in progress</p>
              </div>
              <div className="admin-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Pending shipments</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {pendingShipmentCount}
                </p>
                <p className="mt-1 text-sm text-slate-500">Awaiting fulfillment</p>
              </div>
              <div className="admin-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Active revenue</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  PKR {totalRevenue.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-slate-500">Based on active orders</p>
              </div>
            </div>
          </div>

          <div className="admin-card overflow-hidden rounded-3xl">
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
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
                <h3 className="mt-2 text-lg font-medium text-slate-900">No active orders</h3>
                <p className="mt-1 text-sm text-slate-500">
                  There are currently no active orders to display.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {orders.map((order) => (
                      <>
                        <tr key={order._id} className="hover:bg-slate-50/80 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <span className="text-emerald-700 font-medium">
                                  {order.address.firstName.charAt(0)}{order.address.lastName.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">
                                  {order.address.firstName} {order.address.lastName}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {order.address.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatDate(order.orderDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex -space-x-1">
                              {order.products.slice(0, 3).map((product, idx) => (
                                <div 
                                  key={idx}
                                  className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs"
                                  title={product.name}
                                >
                                  {product.name.charAt(0)}
                                </div>
                              ))}
                              {order.products.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs">
                                  +{order.products.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            PKR {order.totalAmount.toFixed(2)}
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
                              className={`mr-3 ${expandedOrder === order._id ? 'text-emerald-600' : 'text-slate-600'} hover:text-emerald-700`}
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
                            <td colSpan="7" className="px-6 py-4 bg-slate-50/70">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h3 className="text-lg font-medium text-slate-900 mb-3 pb-2 border-b border-slate-200">Customer Information</h3>
                                  <div className="space-y-2">
                                    <div className="flex">
                                      <span className="text-sm font-medium text-slate-500 w-24">Name:</span>
                                      <span className="text-sm text-slate-900">{order.address.firstName} {order.address.lastName}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-sm font-medium text-slate-500 w-24">Email:</span>
                                      <span className="text-sm text-slate-900">{order.address.email}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-sm font-medium text-slate-500 w-24">Phone:</span>
                                      <span className="text-sm text-slate-900">{order.address.phone}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-sm font-medium text-slate-500 w-24">Address:</span>
                                      <span className="text-sm text-slate-900">
                                        {order.address.address}, {order.address.city}, {order.address.country} - {order.address.postalCode}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-slate-900 mb-3 pb-2 border-b border-slate-200">Order Settings</h3>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
                                      <select
                                        className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        value={order.status}
                                        onChange={(e) => handleOrderUpdate(order._id, { status: e.target.value })}
                                      >
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-slate-600 mb-1">Shipping Status</label>
                                      <select
                                        className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        value={order.shippingStatus}
                                        onChange={(e) => handleOrderUpdate(order._id, { shippingStatus: e.target.value })}
                                      >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-slate-600 mb-1">Tracking Number</label>
                                      <input
                                        type="text"
                                        className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        value={order.trackingNumber || ""}
                                        onChange={(e) => handleOrderUpdate(order._id, { trackingNumber: e.target.value })}
                                        placeholder="Enter tracking number"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <h3 className="text-lg font-medium text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-200">Products</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {order.products.map((product, index) => (
                                  <div key={index} className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white">
                                    <div className="flex items-start">
                                      <div className="flex-shrink-0 h-16 w-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                                        {product.category === 'kameez shalwar' ? '👗' : 
                                         product.category === 'kurta' ? '👔' : '👕'}
                                      </div>
                                      <div className="ml-4">
                                        <h4 className="text-sm font-medium text-slate-900">{product.name}</h4>
                                        <div className="mt-1 text-xs text-slate-500 space-y-1">
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

export default AdminDashboard;