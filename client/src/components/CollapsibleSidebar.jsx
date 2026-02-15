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

  useEffect(() => {
    onWidthChange(open ? 260 : 80);
  }, [open, onWidthChange]);

  const navItem = (path, label, icon) => {
    const active = location.pathname === path;

    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
        ${
          active
            ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
            : "text-gray-500 hover:text-white hover:bg-white/5"
        }`}
      >
        <span className={`text-lg transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
          {icon}
        </span>
        {open && (
          <span className={`text-sm font-medium tracking-wide transition-opacity duration-300 ${active ? "opacity-100" : "opacity-80"}`}>
            {label}
          </span>
        )}
      </button>
    );
  };

  const isAccountActive = location.pathname === "/lawyer/settings";

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-500 ease-in-out
      ${open ? "w-[260px]" : "w-20"}
      bg-[#050505] border-r border-white/5 flex flex-col justify-between shadow-2xl`}
    >
      {/* HEADER SECTION */}
      <div>
        <div className={`p-6 flex items-center ${open ? "justify-between" : "justify-center"} mb-4`}>
          {open ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
                <span className="text-white font-black text-xs">LS</span>
              </div>
              <span className="font-bold text-white tracking-tight text-lg">LegalSphere</span>
            </div>
          ) : (
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
               <span className="text-white font-black text-sm">LS</span>
            </div>
          )}
          
          {open && (
             <button
             onClick={() => setOpen(!open)}
             className="text-gray-500 hover:text-white transition-colors"
           >
             <span className="text-xl">«</span>
           </button>
          )}
        </div>

        {/* TOGGLE BUTTON FOR CLOSED STATE */}
        {!open && (
          <button 
            onClick={() => setOpen(true)}
            className="w-full flex justify-center py-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <span>»</span>
          </button>
        )}

        {/* NAVIGATION SECTION */}
        <nav className="mt-6 space-y-1 px-3">
          {navItem("/dashboard-lawyer", "Dashboard", "▢")}
          {navItem("/workspace", "AI Workspace", "◈")}
          {navItem("/hearings", "Hearings", "◎")}
          {navItem("/calendar", "Calendar", "◒")}
          {navItem("/tasks", "Tasks", "▤")}
        </nav>
      </div>

      {/* FOOTER / USER SECTION */}
      <div className="p-4 bg-gradient-to-t from-black to-transparent">
        {/* Profile Card */}
        <button
          onClick={() => navigate("/lawyer/settings")}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 mb-4 group
          ${
            isAccountActive
              ? "bg-white/10 text-white border border-white/10"
              : "hover:bg-white/5 text-gray-400 border border-transparent"
          }`}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#111] border border-red-600/30 flex items-center justify-center font-bold text-white overflow-hidden shadow-inner">
               {user.name?.charAt(0)}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#050505] rounded-full"></div>
          </div>

          {open && (
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Verified Attorney</p>
            </div>
          )}
        </button>

        {/* Logout Action */}
        <button
          onClick={logout}
          className={`w-full flex items-center ${open ? "px-4 justify-start" : "justify-center"} py-3 bg-red-600/10 border border-red-600/20 hover:bg-red-600 hover:text-white transition-all duration-300 rounded-xl group`}
        >
          <span className={`text-red-500 group-hover:text-white ${open ? "mr-3" : ""} transition-colors`}>⤶</span>
          {open && <span className="text-xs font-bold uppercase tracking-widest">Logout</span>}
        </button>

        <div className="mt-6">
          <p className="text-[9px] text-gray-600 text-center font-mono tracking-widest uppercase">
            {open ? "Terminal Version 2.0" : "V2"}
          </p>
        </div>
      </div>
    </div>
  );
}