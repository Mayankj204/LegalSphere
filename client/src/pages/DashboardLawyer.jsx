import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getLawyerCases,
  createCase,
  deleteCase,
  updateCase,
} from "../services/caseService";

export default function DashboardLawyer() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= STATE ================= */
  const [cases, setCases] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editCase, setEditCase] = useState(null);
  const [newCase, setNewCase] = useState({
    title: "",
    clientName: "",
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

  /* ================= LOGIC ================= */
  const filteredCases = useMemo(() => {
    return cases.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cases, searchTerm]);

  const filteredNotifications = useMemo(() => {
    if (filter === "Unread") return notifications.filter((n) => !n.isRead);
    if (filter === "Approved") return notifications.filter((n) => n.message.toLowerCase().includes("approved"));
    if (filter === "Rejected") return notifications.filter((n) => n.message.toLowerCase().includes("rejected"));
    return notifications;
  }, [notifications, filter]);

  const stats = useMemo(() => ({
    total: cases.length,
    active: cases.filter(c => c.status !== "Closed").length,
    pendingReq: requests.filter(r => r.status === "Pending").length
  }), [cases, requests]);

  /* ================= HANDLERS ================= */
  const handleUpdate = async () => {
    try {
      await updateCase(editCase._id, editCase);
      setShowEdit(false);
      loadCases();
    } catch { alert("Update failed"); }
  };

  const handleCreate = async () => {
    try {
      await createCase(newCase);
      setShowAdd(false);
      setNewCase({ title: "", clientName: "", court: "", status: "Open", confidential: false });
      loadCases();
    } catch { alert("Creation failed"); }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadRequests();
      loadNotifications();
    } catch { alert("Failed to update status"); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-red-500/30">
      
      {/* TOP NAVIGATION BAR */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">LegalSphere <span className="text-red-600">PRO</span></h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Attorney Dashboard</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8 text-xs font-medium text-gray-400">
              <span className="hover:text-white cursor-pointer transition-colors">Workspace</span>
              <span className="hover:text-white cursor-pointer transition-colors">Calendar</span>
              <span className="hover:text-white cursor-pointer transition-colors">Documents</span>
            </div>
            <button 
              onClick={() => setShowAdd(true)}
              className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
              + NEW CASE
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
        
        {/* STATS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { label: "Total Managed Cases", val: stats.total, color: "border-white/10" },
            { label: "Active Litigations", val: stats.active, color: "border-red-600/30" },
            { label: "Pending Consultations", val: stats.pendingReq, color: "border-white/10" }
          ].map((s, i) => (
            <div key={i} className={`bg-[#0A0A0A] border ${s.color} p-5 rounded-2xl`}>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">{s.label}</p>
              <p className="text-2xl font-light text-white">{s.val}</p>
            </div>
          ))}
        </div>

        {/* PRIMARY SECTION: YOUR CASES */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              Case Portfolio
              <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded border border-white/10 font-mono">{filteredCases.length}</span>
            </h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by title or client..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#111] border border-white/5 rounded-xl px-10 py-2.5 text-sm w-full md:w-80 focus:border-red-600/50 outline-none transition-all"
              />
              <span className="absolute left-4 top-3 text-gray-500 text-xs">🔍</span>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-500 animate-pulse font-mono uppercase text-xs tracking-widest">Initialising Workspace...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((item) => (
                <div key={item._id} className="group relative bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:bg-[#0F0F0F] hover:border-red-600/20 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-2 h-2 rounded-full mt-2 ${item.status === 'Closed' ? 'bg-gray-700' : 'bg-red-600 animate-pulse'}`} />
                    {item.confidential && <span className="text-[9px] bg-red-600/10 text-red-500 border border-red-600/20 px-2 py-0.5 rounded tracking-tighter">CONFIDENTIAL</span>}
                  </div>
                  
                  <h3 className="text-lg font-medium text-white mb-1 group-hover:text-red-500 transition-colors truncate">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-6 font-mono">{item.clientName || 'Unnamed Client'}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">{item.status}</span>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/case/${item._id}/workspace`)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-xs text-white">Open</button>
                      <button onClick={() => { setEditCase(item); setShowEdit(true); }} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-xs text-gray-400">Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECONDARY GRID: REQUESTS & NOTIFICATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* REQUESTS */}
          <section>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Inbound Consultations</h2>
            <div className="space-y-3">
              {requests.length === 0 ? (
                <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl text-gray-600 text-xs">Clear for now.</div>
              ) : (
                requests.slice(0, 4).map((req) => (
                  <div key={req._id} className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-medium text-white">{req.client?.name}</p>
                      <p className="text-[10px] text-gray-500 truncate w-40">{req.message}</p>
                    </div>
                    {req.status === "Pending" ? (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => updateRequestStatus(req._id, "Approved")} className="text-[10px] bg-green-600/10 text-green-500 px-3 py-1 rounded">Accept</button>
                        <button onClick={() => updateRequestStatus(req._id, "Rejected")} className="text-[10px] bg-red-600/10 text-red-500 px-3 py-1 rounded">Deny</button>
                      </div>
                    ) : (
                      <span className="text-[9px] text-gray-600 uppercase font-bold">{req.status}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Activity Log</h2>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-[10px] text-gray-500 outline-none cursor-pointer border-none"
              >
                <option>All</option>
                <option>Unread</option>
              </select>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
              {filteredNotifications.slice(0, 5).map((n) => (
                <div key={n._id} className="p-4 flex gap-4 items-start">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${n.isRead ? 'bg-transparent' : 'bg-red-600'}`} />
                  <div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">{n.message}</p>
                    <p className="text-[9px] text-gray-600 mt-1 uppercase font-mono">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* MODALS - Minimalist Design */}
      {(showAdd || showEdit) && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-light text-white mb-8">{showAdd ? 'Register New Case' : 'Modify Case Record'}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Case Title</label>
                <input 
                  value={showAdd ? newCase.title : editCase.title} 
                  onChange={(e) => showAdd ? setNewCase({...newCase, title: e.target.value}) : setEditCase({...editCase, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm focus:border-red-600 outline-none" 
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Client Name</label>
                <input 
                  value={showAdd ? newCase.clientName : editCase.clientName} 
                  onChange={(e) => showAdd ? setNewCase({...newCase, clientName: e.target.value}) : setEditCase({...editCase, clientName: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm focus:border-red-600 outline-none" 
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Forum/Court</label>
                <input 
                  value={showAdd ? newCase.court : editCase.court} 
                  onChange={(e) => showAdd ? setNewCase({...newCase, court: e.target.value}) : setEditCase({...editCase, court: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm focus:border-red-600 outline-none" 
                />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
              <button 
                onClick={() => { setShowAdd(false); setShowEdit(false); }}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Discard Changes
              </button>
              <button 
                onClick={showAdd ? handleCreate : handleUpdate}
                className="bg-white text-black px-8 py-3 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all active:scale-95"
              >
                {showAdd ? 'CREATE CASE' : 'UPDATE RECORD'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}