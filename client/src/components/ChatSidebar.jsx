// client/src/components/ChatSidebar.jsx
import React, { useEffect, useState } from "react";
import { getAllDocuments } from "../services/documentService";

export default function ChatSidebar({ onSelect, selectedDocId }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getAllDocuments();
        setDocs(list || []);
      } catch (err) {
        console.error("Source Retrieval Error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-[#0A0A0A] text-slate-200 p-6 rounded-3xl h-full overflow-hidden border border-white/5 flex flex-col shadow-2xl">
      
      {/* HEADER */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
          Intelligence Sources
        </h3>
        <p className="text-[9px] text-gray-600 font-mono mt-1 uppercase tracking-tighter">
          {docs.length} Verified Documents
        </p>
      </div>

      {/* DOCUMENT LIST */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {loading ? (
          <div className="py-10 text-center">
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Indexing...</p>
          </div>
        ) : docs.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl">
            <p className="text-[10px] text-gray-700 uppercase tracking-widest">No Sources Linked</p>
          </div>
        ) : (
          docs.map(doc => {
            const isActive = selectedDocId === doc._id;
            return (
              <div
                key={doc._id}
                onClick={() => onSelect(doc)}
                className={`
                  group cursor-pointer p-4 rounded-2xl border transition-all duration-300
                  ${isActive 
                    ? "bg-red-600/10 border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]" 
                    : "bg-[#111] border-white/5 hover:border-red-600/30 hover:bg-[#151515]"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-colors
                    ${isActive ? "bg-red-600 text-white" : "bg-white/5 text-gray-500 group-hover:text-red-500"}
                  `}>
                    DOC
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-xs font-semibold truncate transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-slate-200"}`}>
                      {doc.filename}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[9px] text-gray-600 font-mono">
                        {new Date(doc.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </p>
                      {isActive && (
                        <span className="text-[7px] font-black text-red-500 uppercase tracking-tighter animate-pulse">
                          Active Context
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-[8px] text-gray-700 font-mono text-center uppercase tracking-widest">
          Secure End-to-End Vault
        </p>
      </div>
    </div>
  );
}