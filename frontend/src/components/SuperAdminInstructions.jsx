import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SuperAdminInstructions() {
  const [instructions, setInstructions] = useState([]);
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructions();
  }, []);

  const fetchInstructions = async () => {
    const token = localStorage.getItem("superadminToken");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/superadmin/instructions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInstructions(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/superadmin");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("superadminToken");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/instructions`, 
        { content, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      fetchInstructions();
    } catch (err) {
      alert("Failed to send instruction");
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Instructions</h1>
          <button onClick={() => navigate("/SuperAdminDashboard")} className="bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700">Dashboard</button>
        </div>

        {/* New Instruction Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Send New Instruction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter instructions for admin staff..."
              className="w-full bg-slate-800 border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-purple-500"
              rows="3"
              required
            />
            <div className="flex items-center justify-between">
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-slate-800 border-slate-700 rounded-lg text-sm px-4 py-2"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition">
                Post Instruction
              </button>
            </div>
          </form>
        </div>

        {/* Instructions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Recent Instructions</h2>
          {instructions.map(item => (
            <div key={item._id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-widest ${getPriorityColor(item.priority)}`}>
                  {item.priority} Priority
                </span>
                <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{item.content}</p>
            </div>
          ))}
          {instructions.length === 0 && <p className="text-slate-500 italic text-center py-12">No instructions posted yet.</p>}
        </div>
      </div>
    </div>
  );
}

const getPriorityColor = (p) => {
  switch (p) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-orange-400';
    default: return 'text-emerald-400';
  }
};

export default SuperAdminInstructions;
