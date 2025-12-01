// client/src/pages/workspace/Timeline.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../../services/workspaceService";

export default function Timeline({ caseId }) {
  const [timeline, setTimeline] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
    // eslint-disable-next-line
  }, [caseId]);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getTimeline(caseId);
      setTimeline(data || []);
    } catch (err) {
      console.error("Failed to fetch timeline:", err);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async () => {
    if (!title.trim()) return alert("Title is required.");

    try {
      await workspaceService.addTimelineEvent(caseId, {
        title,
        details,
        timestamp: new Date(),
      });

      setTitle("");
      setDetails("");
      loadTimeline();
    } catch (err) {
      console.error("Add timeline event failed:", err);
      alert("Failed to add event");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Timeline</h2>

      {/* Add Event */}
      <div className="p-4 bg-[#111] rounded border border-red-600/20 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-[#0d0d0d] border border-red-600/30 rounded mb-3"
          placeholder="Event title"
        />

        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full p-3 bg-[#0d0d0d] border border-red-600/30 rounded mb-3"
          rows="3"
          placeholder="Event details..."
        />

        <button
          onClick={addEvent}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Add Event
        </button>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {loading && <p className="text-gray-400">Loading timeline...</p>}

        {!loading && timeline.length === 0 && (
          <p className="text-gray-500 text-sm">No timeline entries yet.</p>
        )}

        {timeline.map((item) => (
          <div
            key={item._id}
            className="p-4 bg-[#111] rounded border border-red-600/20 relative"
          >
            {/* Date Badge */}
            <div className="absolute top-2 right-3 text-xs text-gray-400">
              {new Date(item.timestamp).toLocaleString()}
            </div>

            <p className="text-lg font-semibold text-red-400">{item.title}</p>

            {item.details && (
              <p className="mt-2 text-gray-300 text-sm whitespace-pre-wrap">
                {item.details}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
