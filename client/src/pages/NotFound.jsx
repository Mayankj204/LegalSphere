// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="pt-28 px-4 min-h-[60vh] flex items-center justify-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-10 bg-ls-charcoal/50 backdrop-blur-xl border border-ls-red/10 rounded-lg-2 shadow-card">
        <h1 className="text-6xl font-extrabold text-ls-offwhite">404</h1>
        <p className="mt-4 text-ls-muted">Page not found</p>
        <Link to="/" className="mt-6 inline-block px-6 py-3 bg-ls-red text-white rounded-lg">Return Home</Link>
      </motion.div>
    </div>
  );
}
