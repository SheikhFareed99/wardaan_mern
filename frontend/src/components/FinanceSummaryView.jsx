import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";

function FinanceSummaryView() {
  const navigate = useNavigate();
  const [sales, setSales] = useState(0);
  const [expectedSales, setExpectedSales] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminLogin");
      return;
    }

    const fetchSummary = async () => {
      try {
        const [salesRes, expectedRes, topRes, expenditureRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/finance/monthly-sales`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/finance/expected-sales`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/finance/top-products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/expenditures/total`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSales(Number(salesRes.data?.total || 0));
        setExpectedSales(Number(expectedRes.data?.total || 0));
        setTopProducts(topRes.data?.products || []);
        setTotalExpenditure(Number(expenditureRes.data?.total || 0));
      } catch (err) {
        console.error("Error fetching finance summary:", err);
        setError("Unable to load finance summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [navigate]);

  const netProfit = sales - totalExpenditure;
  const topProduct = topProducts[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center py-20 text-gray-600">Loading finance summary...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Finance Summary</h1>
          <p className="text-sm text-gray-600">Snapshot of revenue, costs, and top performers.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Revenue</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">Rs. {sales.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Expenditure</p>
            <p className="mt-2 text-2xl font-semibold text-red-600">Rs. {totalExpenditure.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Net Profit</p>
            <p className={`mt-2 text-2xl font-semibold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              Rs. {netProfit.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">Projected Sales</p>
            <p className="mt-2 text-2xl font-semibold text-purple-600">Rs. {expectedSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Top Products</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-600">No top products data available.</p>
            ) : (
              <div className="space-y-3 text-sm">
                {topProducts.slice(0, 5).map((product) => (
                  <div key={product._id} className="flex justify-between">
                    <span className="text-gray-800">{product.name}</span>
                    <span className="text-gray-500">{product.totalSold} sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Highlight</h2>
            {topProduct ? (
              <div className="text-sm text-gray-700 space-y-2">
                <p><span className="font-medium">Top Product:</span> {topProduct.name}</p>
                <p><span className="font-medium">Units Sold:</span> {topProduct.totalSold}</p>
                <p><span className="font-medium">Contribution:</span> {topProduct.totalSold} units in top list</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No highlight available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceSummaryView;
