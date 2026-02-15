// src/components/WorkspaceTabs.jsx
import React from "react";

const tabs = [
  { key: "overview", label: "Overview", icon: "⬚" },
  { key: "documents", label: "Documents", icon: "▤" },
  { key: "notes", label: "Notes", icon: "◈" },
  { key: "aiworkspace", label: "AI Workspace", icon: "✧" },
  { key: "timeline", label: "Timeline", icon: "◎" },
  { key: "billing", label: "Billing", icon: "◒" },
];

export default function WorkspaceTabs({ active, onChange }) {
  return (
    <div className="relative flex items-center gap-1 bg-[#050505] p-1 border-b border-white/5 overflow-x-auto no-scrollbar">
      {tabs.map((t) => {
        const isActive = active === t.key;
        
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`
              relative flex items-center gap-2 py-3 px-5 transition-all duration-500 group
              ${isActive 
                ? "text-white" 
                : "text-gray-500 hover:text-gray-300"
              }
            `}
          >
            {/* ICON & LABEL */}
            <span className={`text-xs transition-transform duration-300 ${isActive ? "text-red-600 scale-110" : "group-hover:scale-110"}`}>
              {t.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              {t.label}
            </span>

            {/* ACTIVE INDICATOR: GLOWING LINE */}
            {isActive && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
            )}

            {/* HOVER INDICATOR */}
            {!isActive && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white/20 transition-all duration-300 group-hover:w-full" />
            )}
          </button>
        );
      })}

      {/* TERMINAL METADATA */}
      <div className="hidden lg:flex ml-auto pr-6 items-center gap-4">
        <div className="h-4 w-px bg-white/10" />
        <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">
          Workspace_V2.0
        </span>
      </div>
    </div>
  );
}