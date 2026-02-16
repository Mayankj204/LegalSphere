// client/src/pages/UpcomingHearings.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../services/workspaceService";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function UpcomingHearings() {
  const navigate = useNavigate();
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newHearing, setNewHearing] = useState({
    caseId: "",
    date: "",
    court: "",
    purpose: "",
  });

  /* ================= LOAD ================= */

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

  // ESC close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowAdd(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ================= ADD HEARING ================= */

  const addHearing = async () => {
    if (!newHearing.caseId.trim() || !newHearing.date) {
      alert("Case ID and Date are required.");
      return;
    }

    try {
      setSubmitting(true);

      await workspaceService.addHearing(newHearing.caseId.trim(), {
        date: new Date(newHearing.date), // safer date conversion
        court: newHearing.court,
        purpose: newHearing.purpose,
      });

      setShowAdd(false);
      setNewHearing({
        caseId: "",
        date: "",
        court: "",
        purpose: "",
      });

      await loadHearings();
    } catch (err) {
      console.error("Schedule commit failed:", err);
      alert("Failed to register hearing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 pt-28 pb-20 px-8">

        {/* HEADER */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-2 bg-red-600 rounded-full" />
              Court Schedule
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-mono mt-1">
              Central Registry // {hearings.length} Active Listings
            </p>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
          >
            + Register Hearing
          </button>
        </div>

        {/* HEARINGS LIST */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-500 uppercase text-xs animate-pulse">
              Synchronizing Master Schedule...
            </div>
          ) : hearings.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-white/5 rounded-3xl">
              <p className="text-xs text-gray-600 uppercase">
                No hearings detected
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {hearings.map((h) => (
                <div
                  key={h._id}
                  className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-red-600/30 transition"
                >
                  <div className="flex justify-between items-start gap-6">
                    <div>
                      <p className="text-2xl text-white font-light">
                        {new Date(h.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {h.court || "Court not specified"}
                      </p>
                      <p className="text-sm text-gray-300 italic mt-1">
                        "{h.purpose || "No purpose specified"}"
                      </p>
                    </div>

                    {h.caseId && (
                      <button
                        onClick={() =>
                          navigate(`/case/${h.caseId}/workspace`)
                        }
                        className="px-5 py-2 bg-white/5 hover:bg-white/10 text-xs rounded-xl"
                      >
                        Workspace
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= MODAL ================= */}
        {showAdd && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6"
            onClick={() => setShowAdd(false)}
          >
            <div
              className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-3xl p-10 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setShowAdd(false)}
                className="absolute top-5 right-6 text-gray-500 hover:text-white text-xl"
              >
                ✕
              </button>

              <h3 className="text-xl text-white mb-8">
                Register Hearing
              </h3>

              <div className="space-y-6">
                <input
                  placeholder="Case ID"
                  value={newHearing.caseId}
                  onChange={(e) =>
                    setNewHearing((s) => ({
                      ...s,
                      caseId: e.target.value,
                    }))
                  }
                  className="w-full p-4 bg-black border border-white/10 rounded-xl text-sm"
                />

                <input
                  type="date"
                  value={newHearing.date}
                  onChange={(e) =>
                    setNewHearing((s) => ({
                      ...s,
                      date: e.target.value,
                    }))
                  }
                  className="w-full p-4 bg-black border border-white/10 rounded-xl text-sm"
                />

                <input
                  placeholder="Court"
                  value={newHearing.court}
                  onChange={(e) =>
                    setNewHearing((s) => ({
                      ...s,
                      court: e.target.value,
                    }))
                  }
                  className="w-full p-4 bg-black border border-white/10 rounded-xl text-sm"
                />

                <input
                  placeholder="Purpose"
                  value={newHearing.purpose}
                  onChange={(e) =>
                    setNewHearing((s) => ({
                      ...s,
                      purpose: e.target.value,
                    }))
                  }
                  className="w-full p-4 bg-black border border-white/10 rounded-xl text-sm"
                />
              </div>

              <div className="mt-10 flex justify-end gap-3">
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-6 py-2 text-xs text-gray-500 hover:text-white uppercase"
                >
                  Cancel
                </button>

                <button
                  onClick={addHearing}
                  disabled={submitting}
                  className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold uppercase text-white disabled:opacity-50"
                >
                  {submitting ? "Committing..." : "Commit to Registry"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
