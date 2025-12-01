import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-red-600/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-extrabold text-red-500 tracking-wider">
          LegalSphere
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-gray-200">

          <Link to="/search-lawyers" className="hover:text-red-500 transition">
            Find Lawyers
          </Link>

          {/* GENERAL AI ASSISTANT */}
          {user && (
            <Link to="/ai-assistant" className="hover:text-red-500 transition">
              AI Assistant
            </Link>
          )}

          {/* CASE DOCUMENT AI WORKSPACE */}
          {user && (
            <Link to="/workspace" className="hover:text-red-500 transition">
              AI Workspace
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-red-500 transition">Login</Link>
              <Link to="/register" className="hover:text-red-500 transition">Register</Link>
            </>
          )}

          {user && (
            <>
              <Link
                to={user.role === "client" ? "/dashboard-client" : "/dashboard-lawyer"}
                className="hover:text-red-500 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="text-red-500 font-semibold hover:text-red-400"
              >
                Logout
              </button>
            </>
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
        <div className="md:hidden bg-black/80 border-t border-red-500/20">
          <div className="px-6 py-4 space-y-3">

            <Link to="/search-lawyers" onClick={() => setOpen(false)} className="block">
              Find Lawyers
            </Link>

            {/* GENERAL AI ASSISTANT */}
            {user && (
              <Link to="/ai-assistant" onClick={() => setOpen(false)} className="block">
                AI Assistant
              </Link>
            )}

            {/* CASE AI WORKSPACE */}
            {user && (
              <Link to="/workspace" onClick={() => setOpen(false)} className="block">
                AI Workspace
              </Link>
            )}

            {!user && (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block">Register</Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to={user.role === "client" ? "/dashboard-client" : "/dashboard-lawyer"}
                  onClick={() => setOpen(false)}
                  className="block"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="block text-red-500 font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
