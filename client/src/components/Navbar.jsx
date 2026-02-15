import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  // Dashboard redirect
  const dashboardPath =
    user?.role === "lawyer"
      ? "/dashboard-lawyer"
      : "/dashboard-client";

  // Account settings redirect
  const profilePath =
    user?.role === "lawyer"
      ? "/lawyer/settings"
      : "/client/settings";

  // 🔥 Smart logo redirect
  const logoRedirect =
    user?.role === "lawyer"
      ? "/dashboard-lawyer"
      : user?.role === "client"
      ? "/dashboard-client"
      : "/";

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

          {/* CLIENT NAV */}
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

              <Link to={profilePath} className="hover:text-red-500 transition">
                Account
              </Link>
            </>
          )}

          {/* LAWYER NAV */}
          {user?.role === "lawyer" && (
            <>
              <Link to={dashboardPath} className="hover:text-red-500 transition">
                Dashboard
              </Link>

              <Link to="/ai-assistant" className="hover:text-red-500 transition">
                AI Assistant
              </Link>

              <Link to="/workspace" className="hover:text-red-500 transition">
                Workspace
              </Link>

              <Link to={profilePath} className="hover:text-red-500 transition">
                Account
              </Link>
            </>
          )}

          {/* PUBLIC NAV */}
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

          {/* LOGOUT */}
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

            {user?.role === "client" && (
              <>
                <Link to="/search-lawyers" onClick={() => setOpen(false)} className="block">
                  Find Lawyers
                </Link>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="block">
                  Dashboard
                </Link>
                <Link to="/ai-assistant" onClick={() => setOpen(false)} className="block">
                  AI Assistant
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
                <Link to="/ai-assistant" onClick={() => setOpen(false)} className="block">
                  AI Assistant
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
