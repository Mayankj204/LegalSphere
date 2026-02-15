// src/components/BillingEntryCard.jsx
import React from "react";

export default function BillingEntryCard({ entry }) {
  // Format the amount for Indian locale
  const formattedAmount = (entry.amount || 0).toLocaleString('en-IN');

  return (
    <div className="group relative bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:bg-[#0F0F0F] hover:border-red-600/30 transition-all duration-300 overflow-hidden shadow-2xl">
      {/* Subtle indicator glow on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative z-10 flex justify-between items-center">
        {/* TRANSACTION METADATA */}
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-[8px] bg-red-600/10 text-red-500 border border-red-600/20 px-2 py-0.5 rounded font-mono uppercase tracking-tighter">
              TXN_ID_{entry._id?.substring(entry._id.length - 4).toUpperCase()}
            </span>
            <p className="font-semibold text-white group-hover:text-red-500 transition-colors">
              {entry.title}
            </p>
          </div>

          {entry.description ? (
            <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-1">
              {entry.description}
            </p>
          ) : (
            <p className="text-xs text-gray-700 italic">No additional transaction notes.</p>
          )}

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">
                {new Date(entry.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <p className="text-[9px] text-gray-700 font-mono uppercase">
              {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* FINANCIAL DATA */}
        <div className="text-right border-l border-white/5 pl-6">
          <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Total Fee</p>
          <p className="text-xl font-light text-white flex items-center justify-end">
            <span className="text-sm text-red-600 font-bold mr-1">₹</span>
            {formattedAmount}
          </p>
          <div className="mt-1">
             <span className="text-[8px] text-green-500/60 font-mono uppercase">● Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}