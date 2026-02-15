// src/pages/DashboardClient.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function DashboardClient() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Placeholder data - replace with your API state
  const [cases] = useState([
    { id: 1, title: "Property Dispute Case", lawyer: "Advocate Sharma", status: "Ongoing", date: "2026-02-10" },
    { id: 2, title: "Contract Review", lawyer: "Advocate Mehta", status: "Completed", date: "2026-01-25" },
  ]);

  const filteredCases = useMemo(() => {
    return cases.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.lawyer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, cases]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-red-500/30">
        
        {/* TOP NAVIGATION BAR */}
        <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40 px-8 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                LegalSphere <span className="text-red-600">CLIENT</span>
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Personal Legal Workspace</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/search-lawyers")}
                className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95"
              >
                FIND A LAWYER
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-8 py-10">
          
          {/* STATS STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { label: "Active Litigations", val: "02", color: "border-red-600/30" },
              { label: "Pending Requests", val: "01", color: "border-white/10" },
              { label: "Resolved Matters", val: "03", color: "border-white/10" }
            ].map((s, i) => (
              <div key={i} className={`bg-[#0A0A0A] border ${s.color} p-5 rounded-2xl`}>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">{s.label}</p>
                <p className="text-2xl font-light text-white">{s.val}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* LEFT COLUMN: CASE PORTFOLIO */}
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-semibold text-white">Your Cases</h2>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search your cases..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#111] border border-white/5 rounded-xl px-10 py-2 text-sm w-full md:w-64 focus:border-red-600/50 outline-none transition-all"
                  />
                  <span className="absolute left-4 top-2.5 text-gray-500 text-xs">🔍</span>
                </div>
              </div>

              <div className="space-y-4">
                {filteredCases.map((item) => (
                  <div key={item.id} className="group bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:bg-[#0F0F0F] hover:border-red-600/20 transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-white group-hover:text-red-500 transition-colors">{item.title}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">{item.lawyer}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${
                          item.status === 'Ongoing' ? 'bg-red-600/10 text-red-500' : 'bg-green-600/10 text-green-500'
                        }`}>
                          {item.status}
                        </span>
                        <p className="text-[10px] text-gray-600 mt-2 uppercase">{item.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: QUICK SERVICES */}
            <aside className="space-y-8">
              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Services</h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate("/ai-assistant")}
                    className="w-full flex items-center justify-between p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-red-600/40 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">AI Legal Assistant</p>
                      <p className="text-[10px] text-gray-500">Instant document analysis</p>
                    </div>
                    <span className="text-red-600 group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <button 
                    onClick={() => navigate("/case")}
                    className="w-full flex items-center justify-between p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-red-600/40 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">Document Vault</p>
                      <p className="text-[10px] text-gray-500">Securely upload & store</p>
                    </div>
                    <span className="text-red-600 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>

              {/* RECENT ACTIVITY LOG (Placeholder UI) */}
              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">System Status</h2>
                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Encrypted Connection Active
                  </div>
                  <p className="text-[10px] text-gray-600 mt-4 leading-relaxed">
                    All document uploads are protected by 256-bit AES encryption. Your data is only visible to your assigned legal counsel.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        </main>
      </div>
    </PageTransition>
  );
}