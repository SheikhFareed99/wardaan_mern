import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SuperAdminTraffic() {
  const [data, setData] = useState({ traffic: [], stats: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTraffic = async () => {
      const token = localStorage.getItem("superadminToken");
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/superadmin/traffic`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        if (err.response?.status === 401) navigate("/superadmin");
      } finally {
        setLoading(false);
      }
    };
    fetchTraffic();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Traffic Data...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Web Traffic Insights</h1>
          <button onClick={() => navigate("/SuperAdminDashboard")} className="text-sm bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700">Dashboard</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Most Visited Pages */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">Top Pages</h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                  <span className="text-slate-300 font-mono text-sm truncate mr-2">{stat._id}</span>
                  <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full text-xs font-bold">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Logs */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Live Traffic Logs</h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Path</th>
                    <th className="px-6 py-4">Device Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.traffic.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/20 text-sm">
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 text-white font-mono">{log.path}</td>
                      <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{log.userAgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminTraffic;
