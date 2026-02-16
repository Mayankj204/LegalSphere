import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getLawyerCases,
  createCase,
  updateCase,
} from "../services/caseService";

export default function DashboardLawyer() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Core Data State
  const [cases, setCases] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // UI Toggle State
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  // Form State
  const [editCase, setEditCase] = useState(null);
  const [newCase, setNewCase] = useState({
    title: "",
    court: "",
    status: "Open",
    confidential: false,
  });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadCases();
    loadRequests();
    loadNotifications();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const data = await getLawyerCases();
      setCases(data || []);
    } catch {
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/requests/lawyer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data || []);
    } catch {
      console.error("Failed to load requests");
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data || []);
    } catch {
      console.error("Failed to load notifications");
    }
  };

  /* ================= HANDLERS ================= */

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCase((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCase(newCase);
      setShowAdd(false);
      setNewCase({ title: "", court: "", status: "Open", confidential: false });
      loadCases();
    } catch {
      alert("Creation failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateCase(editCase._id, { status: editCase.status });
      setShowEdit(false);
      loadCases();
    } catch {
      alert("Update failed");
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadRequests();
    } catch (err) {
      alert("Failed to update request");
    }
  };

  const deleteRequest = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadRequests();
    } catch (err) {
      alert("Failed to delete request");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadNotifications();
    } catch (err) {
      console.error("Failed to delete notification");
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications");
    }
  };

  /* ================= MEMOIZED DATA ================= */

  const stats = useMemo(() => ({
    total: cases.length,
    active: cases.filter((c) => ["Open", "In Progress"].includes(c.status)).length,
    pendingReq: requests.filter((r) => r.status === "Pending").length,
  }), [cases, requests]);

  const filteredCases = useMemo(() => {
    if (!searchTerm.trim()) return cases;
    return cases.filter((c) =>
      c.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cases, searchTerm]);

  /* ================= STYLES ================= */

  const inputClass = "w-full bg-black border border-white/10 p-3 rounded-xl mt-1 text-sm focus:border-red-600 outline-none";
  const labelClass = "text-[10px] uppercase text-gray-500 font-bold tracking-widest";

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans">
      {/* NAVIGATION */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            LegalSphere <span className="text-red-600">PRO</span>
          </h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-full text-xs font-bold transition-colors"
          >
            + NEW CASE
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <StatCard label="Total Cases" value={stats.total} />
          <StatCard label="Active Cases" value={stats.active} />
          <StatCard label="Pending Requests" value={stats.pendingReq} />
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* LEFT: CASE PORTFOLIO (Main Content) */}
          <section className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Case Portfolio</h2>
              <input
                type="text"
                placeholder="Search cases..."
                className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="text-gray-500">Loading cases...</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCases.map((c) => (
                  <div key={c._id} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all">
                    <h3 className="text-lg text-white mb-1">{c.title}</h3>
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 uppercase tracking-tighter">
                      {c.status}
                    </span>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => navigate(`/case/${c._id}/workspace`)}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        WORKSPACE
                      </button>
                      <button
                        onClick={() => { setEditCase(c); setShowEdit(true); }}
                        className="text-xs text-gray-500 hover:text-white"
                      >
                        EDIT STATUS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT: SIDEBAR (Requests & Activity) */}
          <aside className="space-y-12">
         {/* CLIENT REQUESTS */}
<section className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
  <div className="flex justify-between items-center px-6 py-5 border-b border-white/5 bg-white/[0.02]">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
      <h2 className="text-xs font-bold uppercase text-gray-400 tracking-[0.2em]">
        Incoming Requests
      </h2>
    </div>
    {requests.length > 3 && (
      <button 
        onClick={() => setShowAllRequests(true)} 
        className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors bg-red-500/5 px-3 py-1 rounded-full border border-red-500/20"
      >
        VIEW ALL
      </button>
    )}
  </div>

  <div className="divide-y divide-white/5">
    {requests.length > 0 ? (
      requests.slice(0, 3).map((req) => (
        <div 
          key={req._id} 
          className="group px-6 py-5 flex justify-between items-center hover:bg-white/[0.01] transition-all duration-300"
        >
          <div className="flex items-center gap-4 max-w-[65%]">
            <div className={`h-10 w-10 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-500 ${
              req.status === 'Approved' ? 'border-green-500/50 bg-green-500/10 text-green-500' :
              req.status === 'Rejected' ? 'border-red-500/50 bg-red-500/10 text-red-500' :
              'border-white/10 bg-gradient-to-br from-gray-800 to-black text-gray-400'
            }`}>
              {req.status === 'Approved' ? '✓' : req.status === 'Rejected' ? '✕' : (req.client?.name?.charAt(0) || "C")}
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm text-white font-semibold">
                {req.client?.name || "New Client"}
              </p>
              <p className="text-xs text-gray-500 line-clamp-1 italic font-light">
                "{req.message}"
              </p>
            </div>
          </div>

          {/* STATUS LOGIC */}
          <div className="flex items-center">
            {req.status === "Pending" ? (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <button 
                  onClick={() => updateRequestStatus(req._id, "Approved")} 
                  className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-900/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button 
                  onClick={() => updateRequestStatus(req._id, "Rejected")} 
                  className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-900/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded border animate-in fade-in zoom-in duration-300 ${
                req.status === "Approved" 
                  ? "bg-green-500/10 text-green-500 border-green-500/20" 
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}>
                {req.status}
              </span>
            )}
          </div>
        </div>
      ))
    ) : (
      <div className="px-6 py-10 text-center">
        <p className="text-xs text-gray-600 uppercase tracking-widest italic">Inbox is clear</p>
      </div>
    )}
  </div>
  
  <div className="px-6 py-3 bg-black/40 text-center border-t border-white/5">
    <p className="text-[9px] text-gray-700 uppercase font-medium tracking-tight">
      Automated Response System Active
    </p>
  </div>
</section>

            {/* ACTIVITY CENTER */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold uppercase text-gray-400 tracking-widest">Activity Center</h2>
                <button onClick={() => setShowActivity(true)} className="text-xs text-red-500 hover:underline">Manage</button>
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n._id} className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-300">{n.message}</p>
                    <p className="text-[10px] text-gray-600 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
                {notifications.length === 0 && <p className="text-xs text-gray-600 italic">No recent activity.</p>}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* ================= MODALS ================= */}

      {/* CREATE CASE MODAL */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <h3 className="text-xl text-white mb-6 font-semibold">Initiate New Case</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className={labelClass}>Case Title</label>
              <input required name="title" value={newCase.title} onChange={handleInputChange} className={inputClass} placeholder="e.g. Property Dispute - Sector 4" />
            </div>
            <div>
              <label className={labelClass}>Court</label>
              <input name="court" value={newCase.court} onChange={handleInputChange} className={inputClass} placeholder="e.g. High Court of Delhi" />
            </div>
            <div className="flex items-center gap-3 py-2">
              <input type="checkbox" name="confidential" id="confidential" checked={newCase.confidential} onChange={handleInputChange} className="accent-red-600 h-4 w-4" />
              <label htmlFor="confidential" className="text-xs text-gray-400">Mark as Confidential File</label>
            </div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all">
              Generate Case File
            </button>
          </form>
        </Modal>
      )}

      {/* EDIT CASE MODAL */}
      {showEdit && editCase && (
        <Modal onClose={() => setShowEdit(false)}>
          <h3 className="text-xl text-white mb-6 font-semibold">Update Case Status</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className={labelClass}>Status</label>
              <select 
                value={editCase.status} 
                onChange={(e) => setEditCase({...editCase, status: e.target.value})}
                className={inputClass}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Evidence Pending">Evidence Pending</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest">
              Update Record
            </button>
          </form>
        </Modal>
      )}

      {/* REQUESTS VIEW ALL */}
      {showAllRequests && (
        <Modal onClose={() => setShowAllRequests(false)}>
          <h3 className="text-lg text-white mb-6 font-semibold">All Requests</h3>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <p className="text-white font-medium">{req.client?.name || "Unknown Client"}</p>
                  <p className="text-xs text-gray-500">{req.message}</p>
                </div>
                <button onClick={() => deleteRequest(req._id)} className="text-xs text-red-500 font-bold hover:bg-red-500/10 px-3 py-1 rounded-md">DELETE</button>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ACTIVITY CENTER VIEW ALL */}
      {showActivity && (
        <Modal onClose={() => setShowActivity(false)}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg text-white font-semibold">System Activity</h3>
            <button onClick={clearAllNotifications} className="text-[10px] text-gray-500 hover:text-white uppercase">Clear All</button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
            {notifications.map((n) => (
              <div key={n._id} className="flex justify-between items-start border-b border-white/5 pb-4">
                <p className="text-xs text-gray-300 max-w-[85%]">{n.message}</p>
                <button onClick={() => deleteNotification(n._id)} className="text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= SHARED COMPONENTS ================= */

const StatCard = ({ label, value }) => (
  <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl hover:bg-[#111] transition-all">
    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{label}</p>
    <p className="text-3xl text-white font-light mt-1">{value}</p>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
    <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-xl rounded-3xl p-8 relative">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-gray-500 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {children}
    </div>
  </div>
);