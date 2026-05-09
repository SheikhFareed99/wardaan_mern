import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";

function AdminReports() {
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
        console.error("Error loading reports:", err);
        setError("Unable to load admin reports.");
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

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center py-20 text-gray-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Reports</h1>
            <p className="text-sm text-gray-600">Quick overview of orders and revenue.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/FinanceSummary"
              className="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800 transition"
            >
              Finance Summary
            </Link>
            <Link
              to="/OrdersOverview"
              className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:border-gray-500 transition"
            >
              Orders Overview
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <p className="text-xs uppercase text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <p className="text-xs uppercase text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">Rs. {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <p className="text-xs uppercase text-gray-500">Active Orders</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{statusCounts.active || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Status Breakdown</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Active</span>
                <span>{statusCounts.active || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span>{statusCounts.completed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Cancelled</span>
                <span>{statusCounts.cancelled || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Other</span>
                <span>{statusCounts.unknown || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-600">No recent orders available.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-gray-500">{order.address?.firstName || "Guest"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">Rs. {Number(order.totalAmount || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{order.status || "unknown"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
