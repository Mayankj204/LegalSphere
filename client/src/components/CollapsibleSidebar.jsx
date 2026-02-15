import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CollapsibleSidebar({ onWidthChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const [open, setOpen] = useState(true);

  // 🔒 Only show for lawyers
  if (!user || user.role !== "lawyer") return null;

  // Notify parent whenever width changes
  useEffect(() => {
    onWidthChange(open ? 256 : 64);
  }, [open]);

  const navItem = (path, label, icon) => {
    const active = location.pathname === path;

    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all
        ${
          active
            ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
            : "bg-[#111] hover:bg-[#1a1a1a] border border-red-600/20"
        }`}
      >
        <span className="text-lg">{icon}</span>
        {open && <span>{label}</span>}
      </button>
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen pt-20 z-40 transition-all duration-300
      ${open ? "w-64" : "w-16"}
      bg-[#0a0a0a] border-r border-red-600/30 flex flex-col justify-between`}
    >
      {/* HEADER */}
      <div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-red-500 font-bold text-lg">LS</span>
            {open && (
              <span className="font-semibold text-white">
                LegalSphere
              </span>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 hover:bg-[#111] rounded transition"
          >
            {open ? "«" : "»"}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-4 space-y-2 px-2">
          {navItem("/dashboard-lawyer", "Home", "🏠")}
          {navItem("/workspace", "AI Workspace", "🤖")}
          {navItem("/hearings", "Hearings", "🔔")}
          {navItem("/calendar", "Calendar", "📅")}
          {navItem("/tasks", "Tasks", "📝")}
          {navItem("/profile-lawyer", "Profile", "👤")}
        </nav>
      </div>

      {/* FOOTER / PROFILE SECTION */}
      <div className="p-4 border-t border-red-600/20">
        {open && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-bold">
              {user.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">Lawyer</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full px-3 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-sm transition"
        >
          {open ? "Logout" : "🚪"}
        </button>

        <div className="mt-3 text-xs text-gray-500 text-center">
          {open ? "Lawyer Panel" : "LS"}
        </div>
      </div>
    </div>
  );
}
