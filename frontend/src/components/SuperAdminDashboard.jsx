import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("superadminToken");
      if (!token) {
        navigate("/superadmin");
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/superadmin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/superadmin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("superadminToken");
    localStorage.removeItem("isSuperAdmin");
    navigate("/superadmin");
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar / Topbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">SA</span>
              </div>
              <h1 className="text-xl font-bold text-white">SuperAdmin Panel</h1>
            </div>
            <button onClick={handleLogout} className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome back, SuperAdmin</h2>
          <p className="text-slate-400 mt-1">Here is what's happening on Wardaan Wear today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon="🛍️" color="bg-blue-500/10 text-blue-500" />
          <StatCard title="Total Admins" value={stats?.totalAdmins || 0} icon="👥" color="bg-purple-500/10 text-purple-500" />
          <StatCard title="Traffic Visits" value={stats?.totalTraffic || 0} icon="📈" color="bg-emerald-500/10 text-emerald-500" />
          <StatCard title="Revenue (Est)" value="Coming Soon" icon="💰" color="bg-orange-500/10 text-orange-500" />
        </div>

        {/* Navigation Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuLink to="/SuperAdminAccounts" title="Account Management" desc="Manage admin roles and permissions" icon="🔒" />
          <MenuLink to="/SuperAdminTraffic" title="Web Traffic" desc="Monitor user activity and page views" icon="🌐" />
          <MenuLink to="/SuperAdminOrders" title="Order Management" desc="Set order priorities and track status" icon="📦" />
          <MenuLink to="/SuperAdminInstructions" title="Admin Instructions" desc="Send guidance and tasks to admins" icon="📝" />
          <MenuLink to="/AdminDashboard" title="Regular Admin View" desc="Access the standard admin dashboard" icon="👔" />
          <MenuLink to="/" title="Live Site" desc="View vardaanwear.pk" icon="🌍" />
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats?.recentOrders?.map(order => (
                  <tr key={order._id} className="text-sm">
                    <td className="py-4 text-slate-300">#{order._id.slice(-6)}</td>
                    <td className="py-4 text-white font-medium">{order.address?.firstName} {order.address?.lastName}</td>
                    <td className="py-4 text-slate-300">{order.totalAmount} PKR</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-xs ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-xs ${getPriorityStyle(order.priority)}`}>
                        {order.priority || 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition">
      <div className="flex items-center justify-between mb-4">
        <span className={`p-2 rounded-lg ${color}`}>{icon}</span>
      </div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
    </div>
  );
}

function MenuLink({ to, title, desc, icon }) {
  return (
    <Link to={to} className="group bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:bg-slate-800/50 hover:border-purple-500/50 transition">
      <div className="text-3xl mb-4 group-hover:scale-110 transition duration-300">{icon}</div>
      <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
      <p className="text-slate-400 text-sm">{desc}</p>
    </Link>
  );
}

const getStatusStyle = (status) => {
  switch (status) {
    case 'completed': return 'bg-emerald-500/20 text-emerald-500';
    case 'cancelled': return 'bg-red-500/20 text-red-500';
    case 'shipped': return 'bg-blue-500/20 text-blue-500';
    default: return 'bg-slate-500/20 text-slate-500';
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'Urgent': return 'bg-red-500/20 text-red-500 border border-red-500/30';
    case 'High': return 'bg-orange-500/20 text-orange-500';
    default: return 'bg-slate-500/20 text-slate-500';
  }
};

export default SuperAdminDashboard;
