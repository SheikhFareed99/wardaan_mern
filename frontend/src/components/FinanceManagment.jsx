import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import axios from 'axios';

function FinanceManagement() {
  const navigate = useNavigate();

  // General Sales States
  const [sales, setSales] = useState(null);
  const [expectedSales, setExpectedSales] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Expenditure States
  const [expenditures, setExpenditures] = useState([]);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expFromDate, setExpFromDate] = useState('');
  const [expToDate, setExpToDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminLogin");
    }
  }, [navigate]);

  // Fetch Monthly Sales
  const fetchMonthlySales = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/monthly-sales?from=${fromDate}&to=${toDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSales(res.data.total);
    } catch (err) {
      console.error("Error fetching monthly sales:", err);
    }
  };

  // Fetch Expected Sales
  const fetchExpectedSales = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/expected-sales?from=${fromDate}&to=${toDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpectedSales(res.data.total);
    } catch (err) {
      console.error("Error fetching expected sales:", err);
    }
  };

  // Fetch Top Products
  const fetchTopProducts = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/top-products?from=${fromDate}&to=${toDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching top products:", err);
      setTopProducts([]);
    }
  };

  // Fetch Expenditures and Total
  const fetchExpenditures = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const [expRes, totalRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/expenditures?from=${expFromDate}&to=${expToDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/expenditures/total?from=${expFromDate}&to=${expToDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      setExpenditures(expRes.data);
      setTotalExpenditure(totalRes.data.total);
    } catch (err) {
      console.error("Error fetching expenditures:", err);
    }
  };

  // Filter Expenditures
  const handleFetchExpenditures = () => {
    fetchExpenditures();
  };

  // Add Expenditure
  const addExpenditure = async () => {
    const token = localStorage.getItem("adminToken");
    if (!expAmount) return alert("Amount is required!");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/expenditures`, {
        amount: parseFloat(expAmount),
        description: expDesc
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpAmount('');
      setExpDesc('');
      fetchExpenditures();
    } catch (err) {
      console.error("Error adding expenditure:", err);
    }
  };

  // Delete Expenditure
  const deleteExpenditure = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/expenditures/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenditures();
    } catch (err) {
      console.error("Error deleting expenditure:", err);
    }
  };

  // Initial Load
  useEffect(() => {
    const bootstrapAnalytics = async () => {
      setAnalyticsLoading(true);
      await Promise.all([
        fetchMonthlySales(),
        fetchExpectedSales(),
        fetchTopProducts(),
        fetchExpenditures(),
      ]);
      setAnalyticsLoading(false);
    };

    bootstrapAnalytics();
  }, []);

  const totalRevenue = typeof sales === 'number' ? sales : 0;
  const projectedRevenue = typeof expectedSales === 'number' ? expectedSales : 0;
  const netProfit = totalRevenue - totalExpenditure;
  const profitMargin = totalRevenue > 0 ? Math.max(0, Math.round((netProfit / totalRevenue) * 100)) : 0;
  const topProduct = topProducts[0] || null;
  const totalTopProductSales = Array.isArray(topProducts)
    ? topProducts.reduce((sum, product) => sum + product.totalSold, 0)
    : 0;
  const topProductShare = topProduct && totalTopProductSales > 0
    ? Math.round((topProduct.totalSold / totalTopProductSales) * 100)
    : 0;

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Finance Dashboard</h1>
              <p className="text-gray-500">Track and manage your financial performance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                <input 
                  type="date" 
                  value={fromDate} 
                  onChange={(e) => setFromDate(e.target.value)} 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                <input 
                  type="date" 
                  value={toDate} 
                  onChange={(e) => setToDate(e.target.value)} 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={loadAnalytics}
                  disabled={analyticsLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  {analyticsLoading ? 'Loading...' : 'Load Analytics'}
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="font-semibold text-gray-800">Advanced Analytics</h2>
                <p className="text-sm text-gray-500">Revenue, profit, and product insights at a glance</p>
              </div>
              <div className="text-sm text-gray-500">Updated from live finance endpoints</div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Revenue</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">Rs. {totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Current selected period</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Expenditure</p>
                  <p className="mt-2 text-2xl font-bold text-red-600">Rs. {totalExpenditure.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Operational spend</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Net Profit</p>
                  <p className={`mt-2 text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Rs. {netProfit.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Margin {profitMargin}%</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Projected Revenue</p>
                  <p className="mt-2 text-2xl font-bold text-purple-600">Rs. {projectedRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Expected future sales</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Top Product Performance</h3>
                    <button onClick={fetchTopProducts} className="text-sm text-blue-600 hover:text-blue-800">Refresh</button>
                  </div>
                  {Array.isArray(topProducts) && topProducts.length > 0 ? (
                    <div className="space-y-4">
                      {topProducts.slice(0, 5).map((product, index) => {
                        const maxSold = topProducts[0]?.totalSold || 1;
                        const width = Math.max(8, Math.round((product.totalSold / maxSold) * 100));
                        return (
                          <div key={`${product.name}-${index}`}>
                            <div className="flex items-center justify-between text-sm mb-1 gap-3">
                              <span className="font-medium text-gray-800 truncate">{product.name}</span>
                              <span className="text-gray-500 whitespace-nowrap">{product.totalSold} sold</span>
                            </div>
                            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600" style={{ width: `${width}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No product analytics available yet.</p>
                  )}
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Quick Insights</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-500">Top product</p>
                      <p className="font-medium text-gray-900">{topProduct?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Share of top-product sales</p>
                      <p className="font-medium text-gray-900">{topProductShare}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expense pressure</p>
                      <p className="font-medium text-gray-900">{totalRevenue > 0 ? Math.round((totalExpenditure / totalRevenue) * 100) : 0}% of revenue</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className={`font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {netProfit >= 0 ? 'Healthy margin' : 'Revenue below spend'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Sales Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Sales</p>
                    {typeof sales === 'number' ? (
                      <p className="text-2xl font-bold text-gray-800 mt-1">Rs. {sales.toLocaleString()}</p>
                    ) : (
                      <p className="text-gray-400 mt-1">-</p>
                    )}
                  </div>
                  <button 
                    onClick={fetchMonthlySales}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Compared to last period</p>
                </div>
              </div>
            </div>

            {/* Expected Sales Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Additional projected Revenue</p>
                    {typeof expectedSales === 'number' ? (
                      <p className="text-2xl font-bold text-gray-800 mt-1">Rs. {expectedSales.toLocaleString()}</p>
                    ) : (
                      <p className="text-gray-400 mt-1">-</p>
                    )}
                  </div>
                  <button 
                    onClick={fetchExpectedSales}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-sm font-medium bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Based on current trends</p>
                </div>
              </div>
            </div>

            {/* Top Products Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Top Products</p>
                    <p className="text-xs text-gray-400 mt-1">By units sold</p>
                  </div>
                  <button 
                    onClick={fetchTopProducts}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-sm font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {Array.isArray(topProducts) && topProducts.length > 0 ? (
                    topProducts.slice(0, 3).map((product, i) => (
                      <div key={i} className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                          i === 0 ? 'bg-amber-500 text-white' : 
                          i === 1 ? 'bg-gray-400 text-white' : 
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-800">{product.totalSold} units</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Top Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Product Performance</h2>
              <button 
                onClick={fetchTopProducts}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Refresh Data
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(topProducts) && topProducts.length > 0 ? (
                    topProducts.map((product, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                            i < 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.totalSold}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Rs. {(product.totalSold * product.price).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div 
                                className="bg-blue-500 h-1.5 rounded-full" 
                                style={{ width: `${(product.totalSold / topProducts[0].totalSold) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {Math.round((product.totalSold / topProducts.reduce((sum, p) => sum + p.totalSold, 0)) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No product data available. Click "Refresh Data" to load.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expenditures Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Expenditure Management</h2>
            </div>
            
            <div className="p-6">
              {/* Filter and Add Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Expenditures</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                      <input 
                        type="date" 
                        value={expFromDate} 
                        onChange={(e) => setExpFromDate(e.target.value)} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                      <input 
                        type="date" 
                        value={expToDate} 
                        onChange={(e) => setExpToDate(e.target.value)} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                    <div className="self-end">
                      <button 
                        onClick={handleFetchExpenditures}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Apply Filter
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Expenditure</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Amount (Rs.)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={expAmount}
                        onChange={(e) => setExpAmount(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <input
                        type="text"
                        placeholder="What was this for?"
                        value={expDesc}
                        onChange={(e) => setExpDesc(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div className="self-end">
                      <button 
                        onClick={addExpenditure}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Expenditures</p>
                    <p className="text-2xl font-bold text-gray-800">Rs. {totalExpenditure.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Period</p>
                    <p className="text-sm text-gray-600">
                      {expFromDate || 'Start'} to {expToDate || 'Now'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expenditures Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenditures.length > 0 ? (
                      expenditures.map((exp) => (
                        <tr key={exp._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(exp.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">{exp.description || 'No description'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-red-600">- Rs. {exp.amount.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => deleteExpenditure(exp._id)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No expenditures found. Add one above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FinanceManagement;