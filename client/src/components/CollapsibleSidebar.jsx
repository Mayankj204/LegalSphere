// CollapsibleSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CollapsibleSidebar({ onWidthChange }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  // Notify parent whenever width changes
  useEffect(() => {
    onWidthChange(open ? 256 : 64);   // 64px collapsed, 256px expanded
  }, [open]);

  return (
    <div
      className={`fixed top-0 left-0 h-screen pt-20 z-40 transition-all duration-300 
      ${open ? "w-64" : "w-16"} bg-[#0a0a0a] border-r border-red-600/30`}
    >
      {/* header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <span className="text-red-500 font-bold">LS</span>
          {open && <span className="font-semibold">LegalSphere</span>}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-[#111] rounded"
        >
          {open ? "«" : "»"}
        </button>
      </div>

      {/* nav */}
      <nav className="mt-4 flex-1 space-y-1 px-2">
        <button onClick={() => navigate("/dashboard-lawyer")} className="btn-nav">
          <span className="text-xl">🏠</span>
          {open && <span>Home</span>}
        </button>

        <button onClick={() => navigate("/workspace")} className="btn-nav">
          <span className="text-xl">🤖</span>
          {open && <span>AI Workspace</span>}
        </button>

        <button onClick={() => navigate("/hearings")} className="btn-nav">
          <span className="text-xl">🔔</span>
          {open && <span>Hearings</span>}
        </button>

        <button onClick={() => navigate("/calendar")} className="btn-nav">
          <span className="text-xl">📅</span>
          {open && <span>Calendar</span>}
        </button>

        <button onClick={() => navigate("/tasks")} className="btn-nav">
          <span className="text-xl">📝</span>
          {open && <span>Tasks</span>}
        </button>
      </nav>

      {/* footer */}
      <div className="p-4 text-sm text-gray-400">{open ? "Lawyer Panel" : "LS"}</div>
    </div>
  );
}
