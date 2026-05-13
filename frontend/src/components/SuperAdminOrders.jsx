import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SuperAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("superadminToken");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/superadmin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/superadmin");
    } finally {
      setLoading(false);
    }
  };

  const updatePriority = async (id, priority) => {
    const token = localStorage.getItem("superadminToken");
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/superadmin/orders/${id}/priority`, { priority }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.map(o => o._id === id ? { ...o, priority } : o));
    } catch (err) {
      alert("Failed to update priority");
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Orders...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Order Management</h1>
          <button onClick={() => navigate("/SuperAdminDashboard")} className="bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700">Dashboard</button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-mono text-purple-400 text-xs">#{order._id.slice(-8)}</td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{order.address?.firstName} {order.address?.lastName}</div>
                      <div className="text-slate-500 text-xs">{order.address?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 text-sm">
                        {order.products?.map(p => `${p.name} (${p.quantity})`).join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-bold">{order.totalAmount} PKR</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.priority || "Normal"} 
                        onChange={(e) => updatePriority(order._id, e.target.value)}
                        className={`bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-2 focus:ring-purple-500 ${getPriorityColor(order.priority)}`}
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const getPriorityColor = (p) => {
  if (p === 'Urgent') return 'text-red-500';
  if (p === 'High') return 'text-orange-400';
  return 'text-slate-400';
};

export default SuperAdminOrders;
