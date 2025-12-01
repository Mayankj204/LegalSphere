// client/src/pages/UpcomingHearings.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../services/workspaceService";
import { useNavigate } from "react-router-dom";

export default function UpcomingHearings() {
  const navigate = useNavigate();
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add hearing modal
  const [showAdd, setShowAdd] = useState(false);
  const [newHearing, setNewHearing] = useState({
    caseId: "",
    date: "",
    court: "",
    purpose: "",
  });

  const loadHearings = async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getHearings();
      setHearings(data || []);
    } catch (err) {
      console.error("Failed to load hearings:", err);
      setHearings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHearings();
  }, []);

  const addHearing = async () => {
    if (!newHearing.caseId || !newHearing.date) {
      return alert("Case ID and date are required");
    }

    try {
      await workspaceService.addHearing(newHearing.caseId, {
        date: newHearing.date,
        court: newHearing.court,
        purpose: newHearing.purpose,
      });

      setShowAdd(false);
      setNewHearing({ caseId: "", date: "", court: "", purpose: "" });
      loadHearings();
    } catch (err) {
      console.error("Add hearing failed:", err);
      alert("Failed to add hearing");
    }
  };

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Upcoming Hearings 📅</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          + Add Hearing
        </button>
      </div>

      {/* HEARINGS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && <p className="text-gray-400">Loading hearings...</p>}

        {!loading && hearings.length === 0 && (
          <p className="text-gray-400">No hearings scheduled.</p>
        )}

        {hearings.map((h) => (
          <div
            key={h._id}
            className="p-5 bg-[#111] rounded border border-red-600/30"
          >
            <p className="text-xl font-semibold text-red-400">
              {new Date(h.date).toLocaleDateString()}
            </p>

            <p className="text-gray-300 mt-2 text-sm">
              <strong>Court:</strong> {h.court || "N/A"}
            </p>

            <p className="text-gray-300 text-sm">
              <strong>Purpose:</strong> {h.purpose || "N/A"}
            </p>

            {h.caseId ? (
              <button
                onClick={() => navigate(`/case/${h.caseId}/workspace`)}
                className="mt-3 px-3 py-2 bg-red-600 rounded hover:bg-red-700 text-sm"
              >
                Open Case Workspace
              </button>
            ) : (
              <p className="text-xs text-gray-500 mt-2">No case assigned</p>
            )}
          </div>
        ))}
      </div>

      {/* ADD HEARING MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="p-6 bg-[#111] rounded border border-red-600/30 w-96">

            <h3 className="text-lg font-semibold mb-4">Schedule New Hearing</h3>

            <input
              placeholder="Case ID"
              value={newHearing.caseId}
              onChange={(e) =>
                setNewHearing((s) => ({ ...s, caseId: e.target.value }))
              }
              className="w-full p-3 bg-[#0d0d0d] border border-red-600/20 rounded mb-3"
            />

            <input
              type="date"
              value={newHearing.date}
              onChange={(e) =>
                setNewHearing((s) => ({ ...s, date: e.target.value }))
              }
              className="w-full p-3 bg-[#0d0d0d] border border-red-600/20 rounded mb-3"
            />

            <input
              placeholder="Court"
              value={newHearing.court}
              onChange={(e) =>
                setNewHearing((s) => ({ ...s, court: e.target.value }))
              }
              className="w-full p-3 bg-[#0d0d0d] border border-red-600/20 rounded mb-3"
            />

            <input
              placeholder="Purpose"
              value={newHearing.purpose}
              onChange={(e) =>
                setNewHearing((s) => ({ ...s, purpose: e.target.value }))
              }
              className="w-full p-3 bg-[#0d0d0d] border border-red-600/20 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-2 bg-[#333] rounded hover:bg-[#444]"
              >
                Cancel
              </button>

              <button
                onClick={addHearing}
                className="px-3 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
