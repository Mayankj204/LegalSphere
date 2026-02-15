// src/components/AIResultBox.jsx
import React from "react";
import toast from "react-hot-toast";

const AIResultBox = ({ title, content, isLatest = false }) => {
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Intelligence copied to clipboard", {
      style: {
        background: "#0A0A0A",
        color: "#fff",
        border: "1px solid rgba(220, 38, 38, 0.2)",
        fontSize: "10px",
        textTransform: "uppercase",
      },
    });
  };

  return (
    <div 
      className={`relative group overflow-hidden rounded-2xl border transition-all duration-500 ${
        isLatest 
          ? "bg-[#0D0D0D] border-red-600/30 shadow-[0_0_30px_rgba(220,38,38,0.05)]" 
          : "bg-[#0A0A0A] border-white/5 opacity-80 hover:opacity-100"
      }`}
    >
      {/* Visual Indicator for Latest Result */}
      {isLatest && (
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-mono ${isLatest ? "text-red-500" : "text-gray-600"}`}>
              {isLatest ? "● ACTIVE_SYNTHESIS" : "○ ARCHIVE_LOG"}
            </span>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              {title}
            </h3>
          </div>

          <button 
            onClick={handleCopy}
            className="text-[9px] uppercase font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5"
          >
            <span>Copy</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <div className="relative">
          <p className="text-sm text-gray-300 leading-relaxed font-sans whitespace-pre-wrap">
            {content}
          </p>
          
          {/* Subtle "Data Decryption" Effect line at bottom */}
          <div className="mt-6 flex gap-1 opacity-20">
             <div className="h-0.5 w-8 bg-red-600" />
             <div className="h-0.5 w-2 bg-gray-600" />
             <div className="h-0.5 w-2 bg-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResultBox;