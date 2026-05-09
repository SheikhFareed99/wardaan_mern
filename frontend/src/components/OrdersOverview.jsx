import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";

function OrdersOverview() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminLogin");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders?status=all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data || []);
      } catch (err) {
        console.error("Error fetching order overview:", err);
        setError("Unable to load orders overview.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const averageOrderValue = orders.length
    ? Math.round(orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0) / orders.length)
    : 0;

  const latestOrders = orders.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center py-20 text-gray-600">Loading orders overview...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders Overview</h1>
          <p className="text-sm text-gray-600">Order status distribution and recent activity.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Active</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{statusCounts.active || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{statusCounts.completed || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Cancelled</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{statusCounts.cancelled || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Avg Order Value</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">Rs. {averageOrderValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {latestOrders.length === 0 ? (
            <p className="text-sm text-gray-600">No orders to display.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
                    <th className="py-2">Order</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {latestOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-2 font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-2 text-gray-700">{order.address?.firstName || "Guest"}</td>
                      <td className="py-2 text-gray-700">Rs. {Number(order.totalAmount || 0).toLocaleString()}</td>
                      <td className="py-2 text-gray-700">{order.status || "unknown"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersOverview;
