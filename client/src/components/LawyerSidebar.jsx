import React from "react";
import { useNavigate } from "react-router-dom";

export default function LawyerSidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 min-h-screen bg-[#0a0a0a] border-r border-red-600/30 p-5 fixed left-0 top-0 pt-24">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <div className="space-y-4">
        <button
          onClick={() => navigate("/dashboard-lawyer")}
          className="w-full text-left px-3 py-2 bg-[#111] hover:bg-[#222] rounded border border-red-600/20"
        >
          🏠 Home
        </button>

        <button
          onClick={() => navigate("/workspace")}
          className="w-full text-left px-3 py-2 bg-[#111] hover:bg-[#222] rounded border border-red-600/20"
        >
          🤖 AI Workspace
        </button>

        <button
          onClick={() => navigate("/cases")}
          className="w-full text-left px-3 py-2 bg-[#111] hover:bg-[#222] rounded border border-red-600/20"
        >
          📂 All Cases
        </button>

        <button
          onClick={() => navigate("/profile-lawyer")}
          className="w-full text-left px-3 py-2 bg-[#111] hover:bg-[#222] rounded border border-red-600/20"
        >
          👤 Profile
        </button>
      </div>

      <div className="mt-10 text-sm text-gray-400">
        LegalSphere — Lawyer Panel
      </div>
    </div>
  );
}
