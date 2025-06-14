import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import axios from 'axios';

function FinanceManagment() {
  const navigate = useNavigate();
  const [monthlySales, setMonthlySales] = useState(null);
  const [expectedSales, setExpectedSales] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminLogin");
    }
  }, [navigate]);

  const fetchMonthlySales = async () => {
    try {
      const res = await axios.get("/api/finance/monthly-sales");
      setMonthlySales(res.data.total);
    } catch (err) {
      console.error("Error fetching monthly sales:", err);
    }
  };

  const fetchExpectedSales = async () => {
    try {
      const res = await axios.get("/api/finance/expected-sales");
      setExpectedSales(res.data.total);
    } catch (err) {
      console.error("Error fetching expected sales:", err);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res = await axios.get("/api/finance/top-products");
      setTopProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching top products:", err);
    }
  };

  return (
    <>
      <AdminHeader />
      <div style={{ padding: "20px" }}>
        <h1>Finance Management</h1>
        
        <button onClick={fetchMonthlySales}>Get Total Sales (This Month)</button>
        {monthlySales !== null && <p>Total Sales This Month: Rs. {monthlySales}</p>}

        <button onClick={fetchExpectedSales}>Get Expected Sales</button>
        {expectedSales !== null && <p>Total Expected Sales: Rs. {expectedSales}</p>}

        <button onClick={fetchTopProducts}>Get Top 5 Selling Products</button>
        {topProducts.length > 0 && (
          <ol>
            {topProducts.map((product, index) => (
              <li key={index}>{product.name} - {product.totalSold} units</li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}

export default FinanceManagment;
