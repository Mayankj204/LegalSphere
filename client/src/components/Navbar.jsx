import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getMyNotifications,
  markNotificationRead,
} from "../services/notificationService";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  /* ================= PATHS ================= */
  const dashboardPath =
    user?.role === "lawyer"
      ? "/dashboard-lawyer"
      : "/dashboard-client";

  const profilePath =
    user?.role === "lawyer"
      ? "/lawyer/settings"
      : "/client/settings";

  const logoRedirect =
    user?.role === "lawyer"
      ? "/dashboard-lawyer"
      : user?.role === "client"
      ? "/dashboard-client"
      : "/";

  /* ================= LOAD NOTIFICATIONS ================= */
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Notification fetch failed", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  /* ================= NOTIFICATION BELL COMPONENT ================= */
  const NotificationBell = () => (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative text-xl hover:text-red-500 transition"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-4 w-80 bg-[#111] border border-red-600/30 rounded-xl shadow-lg p-4 z-50">
          <h3 className="font-semibold mb-3 text-white">
            Notifications
          </h3>

          {notifications.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No notifications yet
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n._id)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    n.isRead
                      ? "bg-[#1a1a1a]"
                      : "bg-red-600/10 border border-red-600/30"
                  }`}
                >
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <header className="w-full fixed top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-red-600/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

        {/* LOGO */}
        <Link
          to={logoRedirect}
          className="text-2xl font-extrabold text-red-500 tracking-wider hover:text-red-400 transition"
        >
          LegalSphere
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-gray-200">

          {/* ================= CLIENT NAV ================= */}
          {user?.role === "client" && (
            <>
              <Link to="/search-lawyers" className="hover:text-red-500 transition">
                Find Lawyers
              </Link>

              <Link to={dashboardPath} className="hover:text-red-500 transition">
                Dashboard
              </Link>

              <Link to="/ai-assistant" className="hover:text-red-500 transition">
                AI Assistant
              </Link>

              <NotificationBell />

              <Link to={profilePath} className="hover:text-red-500 transition">
                Account
              </Link>
            </>
          )}

          {/* ================= LAWYER NAV ================= */}
          {user?.role === "lawyer" && (
            <>
              <Link to={dashboardPath} className="hover:text-red-500 transition">
                Dashboard
              </Link>

              <Link to="/workspace" className="hover:text-red-500 transition">
                Workspace
              </Link>

              <Link to="/ai-assistant" className="hover:text-red-500 transition">
                AI Assistant
              </Link>

              <NotificationBell />

              <Link to={profilePath} className="hover:text-red-500 transition">
                Account
              </Link>
            </>
          )}

          {/* ================= PUBLIC NAV ================= */}
          {!user && (
            <>
              <Link to="/login" className="hover:text-red-500 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-red-500 transition">
                Register
              </Link>
            </>
          )}

          {/* ================= LOGOUT ================= */}
          {user && (
            <button
              onClick={logout}
              className="text-red-500 font-semibold hover:text-red-400 transition"
            >
              Logout
            </button>
          )}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 border border-red-500/40 rounded text-gray-200"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black/90 border-t border-red-500/20">
          <div className="px-6 py-4 space-y-4 text-gray-200">

            {user && (
              <>
                <button
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                  }}
                  className="block"
                >
                  🔔 Notifications ({unreadCount})
                </button>
              </>
            )}

            {user?.role === "client" && (
              <>
                <Link to="/search-lawyers" onClick={() => setOpen(false)} className="block">
                  Find Lawyers
                </Link>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="block">
                  Dashboard
                </Link>
                <Link to={profilePath} onClick={() => setOpen(false)} className="block">
                  Account
                </Link>
              </>
            )}

            {user?.role === "lawyer" && (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="block">
                  Dashboard
                </Link>
                <Link to="/workspace" onClick={() => setOpen(false)} className="block">
                  Workspace
                </Link>
                <Link to={profilePath} onClick={() => setOpen(false)} className="block">
                  Account
                </Link>
              </>
            )}

            {!user && (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block">
                  Register
                </Link>
              </>
            )}

            {user && (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="block text-red-500 font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
