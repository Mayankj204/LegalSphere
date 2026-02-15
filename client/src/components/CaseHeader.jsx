// src/components/CaseHeader.jsx
import React from "react";

export default function CaseHeader({ caseData, refreshCase }) {
  return (
    <div className="relative group bg-[#0A0A0A] border-b border-white/5 p-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-700">
      
      {/* LEFT SECTION: IDENTITY & METADATA */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase group-hover:text-red-500 transition-colors duration-500">
            {caseData.title}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gray-800">Client:</span>
            <span className="text-slate-300 font-bold">{caseData.clientName || caseData.clientId}</span>
          </div>
          
          <span className="hidden md:inline text-gray-800">/</span>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-800">Status:</span>
            <span className={`font-black ${caseData.status === 'Closed' ? 'text-gray-500' : 'text-red-500 animate-pulse'}`}>
              {caseData.status}
            </span>
          </div>

          <span className="hidden md:inline text-gray-800">/</span>

          <div className="flex items-center gap-2">
            <span className="text-gray-800">ID:</span>
            <span className="text-gray-500 font-bold">#{caseData._id?.substring(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: ACTIONS & SECURITY */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        {caseData.confidential && (
          <div className="flex items-center gap-3 px-4 py-2 bg-red-600/5 border border-red-600/20 rounded-2xl shadow-lg">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </div>
            <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">
              Private & Secure
            </span>
          </div>
        )}

        <button 
          onClick={refreshCase} 
          className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-[#111] border border-white/5 hover:border-red-600/40 hover:bg-[#161616] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 group/btn shadow-2xl"
        >
          <span className="group-hover/btn:rotate-180 transition-transform duration-700 text-red-600 font-bold text-lg leading-none">↻</span>
          Update Data
        </button>
      </div>

      {/* Structural visual accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-600/[0.03] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </div>
  );
}