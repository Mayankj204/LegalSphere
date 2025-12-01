// src/pages/DashboardClient.jsx

import PageTransition from "../components/PageTransition";

export default function DashboardClient() {
  return (
    <PageTransition>
      <div className="pt-32 px-4">
        <h1 className="text-4xl font-extrabold text-ls-offwhite">Client Dashboard</h1>
        <p className="text-ls-muted mt-2">Welcome back! Manage your cases.</p>

        <div className="mt-10 p-6 bg-ls-charcoal/40 rounded-lg-2 shadow-card border border-ls-red/10">
          <h2 className="text-xl font-bold text-ls-offwhite">Your Cases</h2>

          <p className="text-ls-muted mt-4">
            (Mock Data) You currently have 2 active cases.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
