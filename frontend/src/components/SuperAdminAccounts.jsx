import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SuperAdminAccounts() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const token = localStorage.getItem("superadminToken");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/superadmin/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/superadmin");
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin account?")) return;
    const token = localStorage.getItem("superadminToken");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/superadmin/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(admins.filter(admin => admin._id !== id));
    } catch (err) {
      alert("Failed to delete admin");
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Accounts</h1>
          <button onClick={() => navigate("/SuperAdminDashboard")} className="text-sm bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700">Back to Dashboard</button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-400">Email</th>
                <th className="px-6 py-4 font-semibold text-slate-400">Created At</th>
                <th className="px-6 py-4 font-semibold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {admins.length > 0 ? admins.map(admin => (
                <tr key={admin._id} className="hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4 text-white font-medium">{admin.email}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => deleteAdmin(admin._id)}
                      className="text-red-400 hover:text-red-300 font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500 italic">No admin accounts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminAccounts;
