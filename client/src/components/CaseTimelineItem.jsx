import React from "react";

export default function CaseTimelineItem({ event }) {
  return (
    <div className="p-3 bg-[#111] rounded border border-red-600/20">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{event.title || event.type}</p>
          <p className="text-sm text-gray-400">{event.details}</p>
        </div>
        <div className="text-xs text-gray-400">
          {new Date(event.timestamp).toLocaleString()}
        </div>
      </div>

      {event.onChainTx && <p className="mt-2 text-xs text-red-400">On-chain tx: {event.onChainTx}</p>}
    </div>
  );
}
