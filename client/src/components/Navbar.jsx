// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getMyNotifications,
  markNotificationRead,
} from "../services/notificationService";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const previousCountRef = useRef(0);
  const audioRef = useRef(null);

  /* ================= PATHS ================= */
  const dashboardPath = user?.role === "lawyer" ? "/dashboard-lawyer" : "/dashboard-client";
  const profilePath = user?.role === "lawyer" ? "/lawyer/settings" : "/client/settings";
  const logoRedirect = user ? dashboardPath : "/";

  /* ================= LOAD NOTIFICATIONS ================= */
  const loadNotifications = async () => {
    try {
      const data = await getMyNotifications();
      if (previousCountRef.current && data.length > previousCountRef.current) {
        audioRef.current?.play();
      }
      previousCountRef.current = data.length;
      setNotifications(data || []);
    } catch (err) {
      console.error("Notification sync failed", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  /* ================= UI COMPONENTS ================= */
  const NavLink = ({ to, children }) => {
    const isActive = pathname === to;
    return (
      <Link 
        to={to} 
        className={`text-sm font-medium transition-all duration-300 hover:text-red-500 relative py-1 ${
          isActive ? "text-white" : "text-gray-400"
        }`}
      >
        {children}
        {isActive && (
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
        )}
      </Link>
    );
  };

  return (
    <header className="w-full fixed top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        
        {/* LOGO */}
        <Link to={logoRedirect} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-red-500 transition-colors">
            LS
          </div>
          <span className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
            LegalSphere
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {!user ? (
            <>
              <NavLink to="/login">Sign In</NavLink>
              <Link 
                to="/register" 
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-red-600/20"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {user.role === "client" && <NavLink to="/search-lawyers">Find a Lawyer</NavLink>}
              <NavLink to={dashboardPath}>My Dashboard</NavLink>
              {user.role === "lawyer" && <NavLink to="/workspace">Case Files</NavLink>}
              <NavLink to="/ai-assistant">AI Helper</NavLink>
              
              <div className="h-5 w-px bg-white/10 mx-1" />

              {/* NOTIFICATION BELL */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`p-2 rounded-full transition-all ${
                    showDropdown ? "bg-white/10 text-red-500" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="relative text-xl">
                    🔔
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-black animate-pulse" />
                    )}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-72 bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-white">Latest Updates</h3>
                      {unreadCount > 0 && <span className="text-[10px] bg-red-600/20 text-red-500 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-gray-500 py-6 text-center">No new updates</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => handleNotificationClick(n._id)}
                            className={`p-3 rounded-xl cursor-pointer transition-all ${
                              n.isRead ? "bg-transparent opacity-50" : "bg-white/5 border border-white/5"
                            }`}
                          >
                            <p className="text-xs text-gray-300">{n.message}</p>
                            <p className="text-[10px] text-gray-500 mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <NavLink to={profilePath}>Settings</NavLink>

              <button
                onClick={logout}
                className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors ml-2"
              >
                Sign Out
              </button>
            </>
          )}
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden fixed inset-0 top-20 bg-black/95 backdrop-blur-lg z-50 p-6">
          <nav className="flex flex-col gap-6 text-xl font-semibold">
            {user ? (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)}>My Dashboard</Link>
                <Link to="/ai-assistant" onClick={() => setOpen(false)}>AI Helper</Link>
                <Link to={profilePath} onClick={() => setOpen(false)} className="text-gray-400">Settings</Link>
                <button onClick={logout} className="text-red-500 text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>Sign In</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="text-red-500">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}