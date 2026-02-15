// src/components/NoteCard.jsx
import React from "react";

export default function NoteCard({ note }) {
  const dateObj = new Date(note.createdAt);

  return (
    <div className="group relative bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:bg-[#0F0F0F] hover:border-red-600/30 transition-all duration-300 overflow-hidden shadow-2xl">
      
      {/* SECURITY ACCENT */}
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600/20 group-hover:bg-red-600 transition-colors duration-300" />

      <div className="relative z-10 flex flex-col h-full">
        
        {/* HEADER: METADATA */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.4)]" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
              Internal Strategy Note
            </span>
          </div>
          
          <div className="text-right">
            <p className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter">
              {dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-[8px] font-mono text-gray-700 uppercase">
              {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
            {note.text}
          </p>
        </div>

        {/* FOOTER: ACTIONS (Optional/Placeholder) */}
        <div className="mt-5 pt-3 border-t border-white/5 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-[8px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
            Edit
          </button>
          <button className="text-[8px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
            Purge
          </button>
        </div>
      </div>
      
      {/* DECORATIVE TERMINAL ELEMENT */}
      <div className="absolute -bottom-1 -right-1 text-[40px] text-white/[0.02] font-black pointer-events-none select-none">
        NOTE
      </div>
    </div>
  );
}