// src/pages/DashboardClient.jsx
import React, { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { getCases } from "../services/caseService";
import { getClientRequests } from "../services/requestService";
import { AuthContext } from "../context/AuthContext";

export default function DashboardClient() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [cases, setCases] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    activeCount: 0,
    resolvedCount: 0,
    connectedLawyers: 0,
  });

  const [loading, setLoading] = useState(true);

  /* ================= LOAD REAL DATA ================= */
  const loadData = async () => {
    try {
      const caseData = await getCases();
      const requestData = await getClientRequests();

      setCases(caseData?.cases || []);
      setStats(caseData?.stats || {});
      setRequests(requestData || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      setCases([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // 🔥 Auto refresh every 20 seconds (real SaaS feel)
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  /* ================= FILTER CASES ================= */
  const filteredCases = useMemo(() => {
    return cases.filter((c) =>
      c.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, cases]);

  /* ================= REQUEST STATS ================= */
  const pendingRequests = requests.filter(
    (r) => r.status === "Pending"
  ).length;

  const approvedRequests = requests.filter(
    (r) => r.status === "Approved"
  ).length;

  /* ================= STATUS COLOR ================= */
  const getStatusStyle = (status) => {
    if (status === "Open" || status === "In Progress")
      return "bg-red-600/10 text-red-500";
    if (status === "Closed")
      return "bg-green-600/10 text-green-500";
    return "bg-yellow-600/10 text-yellow-500";
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-red-500/30">

        {/* ================= NAV ================= */}
        <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40 px-8 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                LegalSphere <span className="text-red-600">CLIENT</span>
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                Welcome back, {user?.name || "Client"}
              </p>
            </div>

            <button
              onClick={() => navigate("/search-lawyers")}
              className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
              FIND A LAWYER
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-8 py-10">

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
            {[
              { label: "Active Cases", val: stats.activeCount },
              { label: "Resolved Cases", val: stats.resolvedCount },
              { label: "Pending Requests", val: pendingRequests },
              { label: "Approved Consultations", val: approvedRequests },
              { label: "Connected Lawyers", val: stats.connectedLawyers },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-[#0A0A0A] border border-red-600/20 p-5 rounded-2xl"
              >
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">
                  {s.label}
                </p>
                <p className="text-2xl font-light text-white">
                  {loading ? "--" : s.val || 0}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ================= CASE LIST ================= */}
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-semibold text-white">
                  Your Cases
                </h2>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search your cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#111] border border-white/5 rounded-xl px-10 py-2 text-sm w-full md:w-64 focus:border-red-600/50 outline-none transition-all"
                  />
                  <span className="absolute left-4 top-2.5 text-gray-500 text-xs">
                    🔍
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="text-gray-500">Loading cases...</div>
              ) : filteredCases.length === 0 ? (
                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 text-gray-500 text-sm">
                  No cases found.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCases.map((item) => (
                    <div
                      key={item._id}
                      className="group bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:bg-[#0F0F0F] hover:border-red-600/20 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-white group-hover:text-red-500 transition-colors">
                            {item.title}
                          </h3>

                          <p className="text-xs text-gray-500 font-mono mt-1">
                            Court: {item.court || "N/A"}
                          </p>

                          {item.lawyerId?.name && (
                            <p className="text-xs text-gray-600 mt-1">
                              Lawyer: {item.lawyerId.name}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${getStatusStyle(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>

                          <p className="text-[10px] text-gray-600 mt-2 uppercase">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() =>
                            navigate(`/case/${item._id}/workspace`)
                          }
                          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                        >
                          Open Workspace
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= SIDE PANEL ================= */}
            <aside className="space-y-8">

              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                  Quick Services
                </h2>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/ai-assistant")}
                    className="w-full flex items-center justify-between p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-red-600/40 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">
                        AI Legal Assistant
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Ask case-related queries
                      </p>
                    </div>
                    <span className="text-red-600 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>

                  <button
                    onClick={() => navigate("/documents")}
                    className="w-full flex items-center justify-between p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-red-600/40 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">
                        Document Vault
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Secure file storage
                      </p>
                    </div>
                    <span className="text-red-600 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                </div>
              </div>

            </aside>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
