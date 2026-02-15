// client/src/pages/UpcomingHearings.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../services/workspaceService";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function UpcomingHearings() {
  const navigate = useNavigate();
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add hearing modal state
  const [showAdd, setShowAdd] = useState(false);
  const [newHearing, setNewHearing] = useState({
    caseId: "",
    date: "",
    court: "",
    purpose: "",
  });

  const loadHearings = async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getHearings();
      setHearings(data || []);
    } catch (err) {
      console.error("Failed to load hearings:", err);
      setHearings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHearings(); }, []);

  const addHearing = async () => {
    if (!newHearing.caseId || !newHearing.date) return;
    try {
      await workspaceService.addHearing(newHearing.caseId, {
        date: newHearing.date,
        court: newHearing.court,
        purpose: newHearing.purpose,
      });
      setShowAdd(false);
      setNewHearing({ caseId: "", date: "", court: "", purpose: "" });
      loadHearings();
    } catch (err) { console.error("Schedule commit failed:", err); }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 pt-28 pb-20 px-8 transition-all duration-500">
        
        {/* HEADER SECTION */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
              Court Schedule
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-mono mt-1">
              Central Registry // {hearings.length} Active Listings
            </p>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95"
          >
            + Register Hearing
          </button>
        </div>

        {/* HEARINGS LISTING */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-20 text-center font-mono text-[10px] text-gray-500 uppercase tracking-[0.4em] animate-pulse">Synchronizing Master Schedule...</div>
          ) : hearings.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-white/5 rounded-[2.5rem]">
              <p className="text-[10px] text-gray-700 uppercase tracking-[0.4em]">No hearings detected in registry</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {hearings.map((h) => (
                <div
                  key={h._id}
                  className="group bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 hover:bg-[#0F0F0F] hover:border-red-600/20 transition-all duration-300 relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/[0.03] blur-[60px] rounded-full -z-10" />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-light text-white group-hover:text-red-500 transition-colors">
                          {new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </span>
                        <span className="text-[10px] font-mono text-gray-600 uppercase">
                          {new Date(h.date).getFullYear()}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-1 bg-red-600 rounded-full" />
                          {h.court || "Jurisdiction Undefined"}
                        </p>
                        <p className="text-xs text-gray-300 font-medium italic">"{h.purpose || "No stated purpose"}"</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                      {h.caseId ? (
                        <button
                          onClick={() => navigate(`/case/${h.caseId}/workspace`)}
                          className="w-full md:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest rounded-xl transition-all"
                        >
                          Access Workspace
                        </button>
                      ) : (
                        <span className="text-[8px] font-mono text-gray-700 uppercase">Unlinked Node</span>
                      )}
                      <p className="text-[9px] text-gray-600 font-mono uppercase tracking-tighter">REF_CASE: {h.caseId?.substring(0,8) || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SCHEDULE MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
            <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-fade-in">
              <h3 className="text-xl font-light text-white mb-8 tracking-tight">Register Hearing listing</h3>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-600 mb-2 block ml-1 tracking-widest">Case ID Reference</label>
                  <input
                    value={newHearing.caseId}
                    onChange={(e) => setNewHearing((s) => ({ ...s, caseId: e.target.value }))}
                    className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:border-red-600 outline-none transition-all font-mono"
                    placeholder="CASE_NODE_ID"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[9px] uppercase font-bold text-gray-600 mb-2 block ml-1 tracking-widest">Hearing Date</label>
                    <input
                      type="date"
                      value={newHearing.date}
                      onChange={(e) => setNewHearing((s) => ({ ...s, date: e.target.value }))}
                      className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:border-red-600 outline-none transition-all invert brightness-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-600 mb-2 block ml-1 tracking-widest">Court Jurisdiction</label>
                  <input
                    value={newHearing.court}
                    onChange={(e) => setNewHearing((s) => ({ ...s, court: e.target.value }))}
                    className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:border-red-600 outline-none transition-all"
                    placeholder="e.g. Supreme Court, Bench III"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-600 mb-2 block ml-1 tracking-widest">Procedural Purpose</label>
                  <input
                    value={newHearing.purpose}
                    onChange={(e) => setNewHearing((s) => ({ ...s, purpose: e.target.value }))}
                    className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:border-red-600 outline-none transition-all"
                    placeholder="e.g. Cross-examination"
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-3">
                <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-xs text-gray-600 hover:text-white transition-colors uppercase font-bold tracking-widest">Cancel</button>
                <button onClick={addHearing} className="px-8 py-3 bg-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-red-500 shadow-lg shadow-red-600/20">Commit to Registry</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}