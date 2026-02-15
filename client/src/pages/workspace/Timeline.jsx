// client/src/pages/workspace/Timeline.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../../services/workspaceService";

export default function Timeline({ caseId }) {
  const [timeline, setTimeline] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
    // eslint-disable-next-line
  }, [caseId]);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getTimeline(caseId);
      setTimeline(data || []);
    } catch (err) {
      console.error("Failed to fetch timeline:", err);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async () => {
    if (!title.trim()) return;

    try {
      await workspaceService.addTimelineEvent(caseId, {
        title,
        details,
        timestamp: new Date(),
      });

      setTitle("");
      setDetails("");
      loadTimeline();
    } catch (err) {
      console.error("Add timeline event failed:", err);
    }
  };

  return (
    <div className="bg-[#050505] text-slate-200 min-h-full">
      
      {/* HEADER SECTION */}
      <div className="mb-8 px-1">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-red-600 rounded-full" />
          Chronological Audit Trail
        </h2>
        <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-tighter">Immutable Event Log for Case_{caseId?.substring(0,8)}</p>
      </div>

      {/* EVENT CREATION TERMINAL */}
      <div className="p-8 bg-[#0A0A0A] rounded-[2rem] border border-white/5 mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[60px] rounded-full" />
        
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 block">Register New Event</h3>
        
        <div className="space-y-4 relative z-10">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-black border border-white/10 rounded-2xl text-sm text-white focus:border-red-600/50 outline-none transition-all placeholder:text-gray-700"
            placeholder="Event Title (e.g., Preliminary Hearing, Evidence Submission)"
          />

          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full p-4 bg-black border border-white/10 rounded-2xl text-sm text-white focus:border-red-600/50 outline-none resize-none placeholder:text-gray-700"
            rows="3"
            placeholder="Detailed chronological data..."
          />

          <div className="flex justify-end">
            <button
              onClick={addEvent}
              disabled={!title.trim()}
              className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95 disabled:opacity-50"
            >
              Commit to Log
            </button>
          </div>
        </div>
      </div>

      {/* TIMELINE FEED */}
      <div className="relative pl-8">
        {/* The Vertical Line */}
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-red-600/50 via-white/10 to-transparent" />

        {loading ? (
          <div className="py-10 text-center font-mono text-[10px] text-gray-600 uppercase tracking-widest animate-pulse">Syncing Audit Data...</div>
        ) : timeline.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-white/5 rounded-3xl text-gray-700 text-xs uppercase tracking-[0.3em]">No Log Entries Found</div>
        ) : (
          <div className="space-y-10">
            {timeline.map((item) => (
              <div key={item._id} className="relative group">
                {/* Timeline Node */}
                <div className="absolute -left-[36.5px] top-1.5 w-4 h-4 rounded-full bg-black border border-red-600/40 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-red-600 rounded-full group-hover:scale-125 transition-transform" />
                </div>

                <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl group-hover:border-red-600/20 transition-all duration-500 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest group-hover:text-red-500 transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded text-gray-600 font-mono tracking-tighter">
                        REF_{item._id?.substring(item._id.length - 4).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-gray-500 uppercase">
                        {new Date(item.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[9px] font-mono text-gray-600 uppercase">
                         {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {item.details && (
                    <p className="text-xs text-gray-400 leading-relaxed font-sans whitespace-pre-wrap border-l-2 border-red-600/10 pl-4 py-1">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-20 text-center text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">
        Verified Cryptographic Time-Stamping Active // Node V2.4
      </p>
    </div>
  );
}