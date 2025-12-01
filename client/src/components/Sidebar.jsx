// src/components/Sidebar.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  return (
    <motion.aside initial={{ x: -250 }} animate={{ x: open ? 0 : -250 }} transition={{ type: "spring", stiffness: 260 }} className="fixed left-0 top-0 h-full w-64 bg-ls-charcoal/60 border-r border-ls-red/10 p-6 z-40">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold">Lawyer Menu</h4>
        <button onClick={onClose} className="text-ls-muted">Close</button>
      </div>

      <nav className="space-y-3">
        <Link to="/lawyer/dashboard" className="block py-2 px-3 rounded-md hover:bg-ls-darkgrey/40">Overview</Link>
        <Link to="/lawyer/dashboard/cases" className="block py-2 px-3 rounded-md hover:bg-ls-darkgrey/40">Cases</Link>
        <Link to="/lawyer/dashboard/ai" className="block py-2 px-3 rounded-md hover:bg-ls-darkgrey/40">AI Tools</Link>
        <Link to="/lawyer/dashboard/settings" className="block py-2 px-3 rounded-md hover:bg-ls-darkgrey/40">Settings</Link>
      </nav>
    </motion.aside>
  );
}
