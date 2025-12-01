// src/pages/DashboardLawyer.jsx

import { useState } from "react";
import PageTransition from "../components/PageTransition";
import Sidebar from "../components/Sidebar";

export default function DashboardLawyer() {
  const [open, setOpen] = useState(false);

  return (
    <PageTransition>
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="pt-32 px-4">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-ls-red text-white rounded-lg shadow-glow"
        >
          Open Menu
        </button>

        <h1 className="text-4xl font-extrabold mt-10">Lawyer Dashboard</h1>
        <p className="text-ls-muted mt-2">
          Manage your cases, clients, and AI tools.
        </p>

        <div className="mt-10 p-6 bg-ls-charcoal/40 rounded-lg-2 shadow-card border border-ls-red/10">
          <h2 className="text-xl font-bold">Overview</h2>
          <p className="text-ls-muted mt-2">(Mock Data) 5 active cases</p>
        </div>
      </div>
    </PageTransition>
  );
}
