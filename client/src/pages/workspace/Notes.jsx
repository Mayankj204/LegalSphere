// client/src/pages/workspace/Notes.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../../services/workspaceService";

export default function Notes({ caseId }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line
  }, [caseId]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getCaseNotes(caseId);
      setNotes(data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const add = async () => {
    if (!text.trim()) return;

    try {
      await workspaceService.addNote(caseId, { text });
      setText("");
      loadNotes();
    } catch (err) {
      console.error("Add note failed:", err);
    }
  };

  return (
    <div className="bg-[#050505] text-slate-200 flex flex-col h-full">
      
      {/* HEADER SECTION */}
      <div className="mb-6 px-1">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-red-600 rounded-full" />
          Strategic Briefing Log
        </h2>
        <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-tighter">Internal Case Annotations</p>
      </div>

      {/* ADD NOTE INTERFACE */}
      <div className="relative mb-8 group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 bg-[#0A0A0A] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-700 resize-none min-h-[100px]"
          placeholder="Enter confidential case observation or legal strategy note..."
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <span className="text-[10px] text-gray-600 font-mono hidden md:block group-focus-within:opacity-100 opacity-0 transition-opacity">
            AUTO-SAVE: ACTIVE
          </span>
          <button
            onClick={add}
            disabled={!text.trim()}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            Post Note
          </button>
        </div>
      </div>

      {/* TIMELINE FEED */}
      <div className="flex-1 space-y-6 pr-2 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="py-20 text-center font-mono text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">
            Retrieving Encrypted Briefs...
          </div>
        ) : notes.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl text-gray-600 text-xs uppercase tracking-widest">
            No entries recorded in strategy log.
          </div>
        ) : (
          <div className="relative pl-6 border-l border-white/5 space-y-8">
            {notes.map((n) => (
              <div key={n._id} className="relative">
                {/* Timeline Node Icon */}
                <div className="absolute -left-[31px] top-1.5 w-2 h-2 bg-red-600 rounded-full border-4 border-black box-content" />
                
                <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl hover:border-red-600/20 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-[9px] text-gray-600 font-mono uppercase tracking-tighter">
                      {new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[9px] text-gray-600 font-mono uppercase tracking-tighter">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                    {n.text}
                  </p>
                  
                  <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[8px] uppercase font-bold text-gray-600 hover:text-red-500">Edit</button>
                    <button className="text-[8px] uppercase font-bold text-gray-600 hover:text-red-500">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">
        Verified Internal Communication Node | Encrypted
      </p>
    </div>
  );
}