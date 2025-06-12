import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";

function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/adminLogin"); 
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/admin/protected/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage(response.data.message);
        setLoading(false);
      } catch (error) {
        console.error("Access denied:", error);
        navigate("/admin");
      }
    };

    fetchProtectedData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-xl text-gray-600">Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        
      </div>
    </>
  );
}

export default AdminDashboard;
