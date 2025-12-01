import React from "react";

export default function BillingEntryCard({ entry }) {
  return (
    <div className="p-4 bg-[#111] rounded border border-red-600/20">
      <div className="flex justify-between items-start">
        {/* Left section */}
        <div>
          <p className="font-semibold text-white text-lg">{entry.title}</p>
          {entry.description && (
            <p className="text-sm text-gray-400 mt-1">{entry.description}</p>
          )}

          <p className="text-xs text-gray-500 mt-2">
            {new Date(entry.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Right section */}
        <div className="text-right">
          <p className="text-xl font-semibold text-red-400">₹{entry.amount}</p>
        </div>
      </div>
    </div>
  );
}
