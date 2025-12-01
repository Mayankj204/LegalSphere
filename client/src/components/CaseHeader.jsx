import React from "react";

export default function CaseHeader({ caseData, refreshCase }) {
  return (
    <div className="p-4 bg-[#0f0f0f] rounded border border-red-600/20 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{caseData.title}</h1>
        <p className="text-sm text-gray-400 mt-1">
          Client: <span className="text-white">{caseData.clientName || caseData.clientId}</span>
          {" • "}
          Status: <span className="text-red-400 ml-1">{caseData.status}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        {caseData.confidential && (
          <span className="px-3 py-1 bg-red-700/20 text-red-300 rounded text-sm border border-red-600/30">
            Confidential
          </span>
        )}
        <button onClick={refreshCase} className="px-3 py-2 bg-[#111] rounded border border-red-600/20">
          Refresh
        </button>
      </div>
    </div>
  );
}
