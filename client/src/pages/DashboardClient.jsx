// src/pages/DashboardClient.jsx

import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function DashboardClient() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="pt-3 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-white">
              Client Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Welcome back! Manage your legal cases and consultations.
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
              <h3 className="text-gray-400 text-sm">Active Cases</h3>
              <p className="text-3xl font-bold text-white mt-2">2</p>
            </div>

            <div className="p-6 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
              <h3 className="text-gray-400 text-sm">Pending Requests</h3>
              <p className="text-3xl font-bold text-white mt-2">1</p>
            </div>

            <div className="p-6 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
              <h3 className="text-gray-400 text-sm">Closed Cases</h3>
              <p className="text-3xl font-bold text-white mt-2">3</p>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid gap-8 lg:grid-cols-3">

            {/* RECENT CASES */}
            <div className="lg:col-span-2 p-6 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
              <h2 className="text-xl font-bold text-white mb-6">
                Recent Cases
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-black/60 rounded-lg border border-red-600/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">
                        Property Dispute Case
                      </p>
                      <p className="text-gray-400 text-sm">
                        Assigned Lawyer: Advocate Sharma
                      </p>
                    </div>
                    <span className="text-sm px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full">
                      Ongoing
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-black/60 rounded-lg border border-red-600/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">
                        Contract Review
                      </p>
                      <p className="text-gray-400 text-sm">
                        Assigned Lawyer: Advocate Mehta
                      </p>
                    </div>
                    <span className="text-sm px-3 py-1 bg-green-600/20 text-green-400 rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
              <h2 className="text-xl font-bold text-white mb-6">
                Quick Actions
              </h2>

              <div className="space-y-4">

                {/* Find Lawyer */}
                <button
                  onClick={() => navigate("/search-lawyers")}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 transition text-white rounded-lg font-semibold shadow-lg shadow-red-600/20"
                >
                  Find a Lawyer
                </button>

                {/* Upload Documents (Example route) */}
                <button
                  onClick={() => navigate("/case")}
                  className="w-full py-3 bg-black/60 border border-red-600/20 hover:bg-black/80 transition text-white rounded-lg"
                >
                  Upload Documents
                </button>

                {/* AI Assistant */}
                <button
                  onClick={() => navigate("/ai-assistant")}
                  className="w-full py-3 bg-black/60 border border-red-600/20 hover:bg-black/80 transition text-white rounded-lg"
                >
                  AI Legal Assistant
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
