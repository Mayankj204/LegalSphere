import React from "react";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "documents", label: "Documents" },
  { key: "notes", label: "Notes" },
  { key: "aitools", label: "AI Tools" },
  { key: "timeline", label: "Timeline" },
  { key: "billing", label: "Billing" },
];

export default function WorkspaceTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 border-b border-red-600/20">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`py-2 px-3 rounded-t ${
            active === t.key
              ? "bg-[#0d0d0d] border border-red-600/30 -mb-px"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
