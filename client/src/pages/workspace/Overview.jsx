import React from "react";

export default function Overview({ caseData }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#111] rounded border border-red-600/20">
          <p className="text-sm text-gray-300">Title</p>
          <p className="font-medium text-white mt-1">{caseData.title}</p>

          <p className="text-sm text-gray-300 mt-3">Client</p>
          <p className="mt-1">{caseData.clientName || caseData.clientId}</p>

          <p className="text-sm text-gray-300 mt-3">Court</p>
          <p className="mt-1">{caseData.court || "-"}</p>

          <p className="text-sm text-gray-300 mt-3">Status</p>
          <p className="mt-1">{caseData.status}</p>
        </div>

        <div className="p-4 bg-[#111] rounded border border-red-600/20">
          <p className="text-sm text-gray-300">Deadlines</p>
          {caseData.deadlines && caseData.deadlines.length ? (
            <ul className="mt-2 space-y-2">
              {caseData.deadlines.map((d, i) => (
                <li key={i} className="text-sm text-gray-200">
                  {d.label} — <span className="text-gray-400">{new Date(d.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-400">No deadlines set</p>
          )}

          <p className="text-sm text-gray-300 mt-4">Collaborators</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(caseData.collaborators || []).map((c) => (
              <span key={c} className="px-2 py-1 bg-[#0d0d0d] text-sm rounded border border-red-600/20">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-[#111] rounded border border-red-600/20">
        <h3 className="font-semibold mb-2">Quick Notes</h3>
        <p className="text-gray-400">{caseData.quickNotes || "No quick notes."}</p>
      </div>
    </div>
  );
}
