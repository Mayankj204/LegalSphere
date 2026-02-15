// src/components/CaseTimelineItem.jsx
import React from "react";

export default function CaseTimelineItem({ event }) {
  const dateObj = new Date(event.timestamp);
  
  return (
    <div className="relative pl-8 group pb-8 last:pb-0">
      {/* TIMELINE ARCHITECTURE: VERTICAL LINE */}
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-red-600/50 via-white/5 to-transparent group-last:h-2" />
      
      {/* TIMELINE NODE: GLOWING CIRCLE */}
      <div className="absolute -left-[4.5px] top-1.5 w-2.5 h-2.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.6)] border-2 border-black z-10" />

      {/* EVENT CARD */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:bg-[#0F0F0F] hover:border-red-600/30 transition-all duration-300 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest group-hover:text-red-500 transition-colors">
              {event.title || event.type}
            </h4>
            <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded text-gray-500 font-mono">
              EVT_{event._id?.substring(event._id.length - 4).toUpperCase() || "LOG"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-gray-600 font-mono uppercase tracking-tighter">
            <span>{dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            <span className="w-1 h-1 bg-gray-800 rounded-full" />
            <span>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          {event.details}
        </p>

        {/* ON-CHAIN SECURITY BADGE */}
        {event.onChainTx && (
          <div className="mt-2 flex items-center gap-3 p-3 bg-red-600/[0.03] border border-red-600/10 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-red-600 uppercase tracking-[0.2em] mb-1">
                Blockchain Verification Hash
              </span>
              <p className="text-[10px] text-red-500/80 font-mono break-all leading-tight">
                {event.onChainTx}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 opacity-50">
               <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[8px] text-green-500 uppercase font-bold">Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}