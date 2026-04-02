  // client/src/pages/UpcomingHearings.jsx
  import React, { useEffect, useState } from "react";
  import workspaceService from "../services/workspaceService";
  import { useNavigate } from "react-router-dom";
  import PageTransition from "../components/PageTransition";

  export default function UpcomingHearings() {
    const navigate = useNavigate();

    const [hearings, setHearings] = useState([]);
    const [cases, setCases] = useState([]); // 🔥 cases state
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [newHearing, setNewHearing] = useState({
      caseId: "",
      date: "",
      court: "",
      purpose: "",
    });

    /* ================= LOAD HEARINGS ================= */
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

    /* ================= LOAD CASES ================= */
  const loadCases = async () => {
    try {
      const res = await workspaceService.getCases?.() 
        || await fetch("http://localhost:5000/api/cases", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then(r => r.json());

      setCases(res.cases || res || []);
    } catch (err) {
      console.error("Failed to load cases:", err);
    }
  };

    useEffect(() => {
      loadHearings();
      loadCases(); // 🔥 load cases
    }, []);

    /* ================= ADD HEARING ================= */
  const addHearing = async () => {
    if (!newHearing.caseId || !newHearing.date) {
      alert("Case and Date are required.");
      return;
    }

    try {
      setSubmitting(true);

      const cleanCaseId = String(newHearing.caseId)
        .replace(/"/g, "")
        .trim();

      console.log("FINAL caseId:", cleanCaseId); // 🔥 DEBUG

      await workspaceService.addHearing(cleanCaseId, {
        date: new Date(newHearing.date),
        court: newHearing.court,
        purpose: newHearing.purpose,
      });
      console.log("TYPE:", typeof newHearing);
console.log("DATA:", newHearing);

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
          <div className="max-w-7xl mx-auto flex justify-between mb-12">
            <h1 className="text-3xl text-white">Court Schedule</h1>

            <button
              onClick={() => setShowAdd(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl"
            >
              + Register Hearing
            </button>
          </div>

          {/* HEARINGS LIST */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : hearings.length === 0 ? (
              <p className="text-center text-gray-500">No hearings found</p>
            ) : (
              hearings.map((h) => (
                <div
                  key={h._id}
                  className="mb-6 border border-white/10 p-6 rounded-xl"
                >
                  <p className="text-white text-lg">
                    {new Date(h.date).toDateString()}
                  </p>

                  <p className="text-gray-400">
                    {h.court || "Court not specified"}
                  </p>

                  <p className="text-gray-300 italic">
                    "{h.purpose || "No purpose specified"}"
                  </p>

                  {h.caseId && (
                    <button
                      onClick={() =>
                        navigate(`/case/${h.caseId}/workspace`)
                      }
                      className="mt-3 px-4 py-2 bg-white/10 rounded-lg text-sm"
                    >
                      Open Case
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* ================= MODAL ================= */}
          {showAdd && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
              <div className="bg-[#111] p-8 rounded-xl w-[400px]">

                <h3 className="text-white mb-6 text-lg">
                  Register Hearing
                </h3>

                {/* 🔥 CASE DROPDOWN */}
                <select
                  value={newHearing.caseId}
                  onChange={(e) =>
                    setNewHearing((prev) => ({
                      ...prev,
                      caseId: e.target.value,
                    }))
                  }
                  className="w-full p-3 mb-4 bg-black border border-white/10 rounded-xl text-sm"
                >
                  <option value="">Select Case</option>

                  {cases.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} ({c._id.slice(-5)})
                    </option>
                  ))}
                </select>

                {/* DATE */}
                <input
                  type="date"
                  value={newHearing.date}
                  onChange={(e) =>
                    setNewHearing((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="w-full p-3 mb-4 bg-black border border-white/10 rounded-xl"
                />

                {/* COURT */}
                <input
                  placeholder="Court"
                  value={newHearing.court}
                  onChange={(e) =>
                    setNewHearing((prev) => ({
                      ...prev,
                      court: e.target.value,
                    }))
                  }
                  className="w-full p-3 mb-4 bg-black border border-white/10 rounded-xl"
                />

                {/* PURPOSE */}
                <input
                  placeholder="Purpose"
                  value={newHearing.purpose}
                  onChange={(e) =>
                    setNewHearing((prev) => ({
                      ...prev,
                      purpose: e.target.value,
                    }))
                  }
                  className="w-full p-3 mb-6 bg-black border border-white/10 rounded-xl"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAdd(false)}
                    className="px-4 py-2 text-gray-400"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={addHearing}
                    disabled={submitting}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl"
                  >
                    {submitting ? "Adding..." : "Add Hearing"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageTransition>
    );
  }