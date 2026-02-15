// client/src/pages/DashboardLawyer.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getLawyerCases,
  createCase,
  updateCase,
  deleteCase,
} from "../services/caseService";

export default function DashboardLawyer() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [cases, setCases] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add case modal state
  const [showAdd, setShowAdd] = useState(false);
  const [newCase, setNewCase] = useState({
    title: "",
    clientName: "",
    court: "",
    status: "Open",
    confidential: false,
  });

  // Edit case modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editCase, setEditCase] = useState(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadCases();
    loadRequests();
    // eslint-disable-next-line
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const data = await getLawyerCases();
      setCases(data || []);
    } catch (err) {
      console.error("Failed to load cases", err);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/requests/lawyer",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load requests", err);
    }
  };

  /* ================= APPROVE / REJECT ================= */

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await loadRequests();
    } catch (err) {
      console.error("Request update failed", err);
      alert("Failed to update request");
    }
  };

  /* ================= CASE HANDLERS ================= */

  const handleCreate = async () => {
    if (!newCase.title.trim()) return alert("Title required");
    try {
      await createCase(newCase);
      setShowAdd(false);
      setNewCase({
        title: "",
        clientName: "",
        court: "",
        status: "Open",
        confidential: false,
      });
      await loadCases();
    } catch (err) {
      alert("Failed to create case");
    }
  };

  const openEditModal = (c) => {
    setEditCase(c);
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!editCase?.title.trim()) return alert("Title required");
    try {
      await updateCase(editCase._id, editCase);
      setShowEdit(false);
      setEditCase(null);
      await loadCases();
    } catch (err) {
      alert("Failed to update case");
    }
  };

  const handleDelete = async (c) => {
    const ok = window.confirm(
      `Delete case "${c.title}"? This cannot be undone.`
    );
    if (!ok) return;

    try {
      await deleteCase(c._id);
      await loadCases();
    } catch (err) {
      alert("Failed to delete case");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, Lawyer 👨‍⚖️</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/calendar")}
            className="px-3 py-2 bg-[#111] rounded border border-red-600/20"
          >
            Calendar
          </button>

          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            + Add New Case
          </button>
        </div>
      </div>

      {/* ================= CONSULTATION REQUESTS ================= */}

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          📩 Consultation Requests
        </h2>

        {requests.length === 0 ? (
          <div className="p-4 bg-[#111] rounded border border-red-600/20">
            No new consultation requests.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="p-5 bg-[#111] rounded border border-red-600/30"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-lg">
                      {req.client?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {req.client?.email}
                    </p>
                    <p className="mt-3 text-gray-300">
                      {req.message}
                    </p>
                    <p className="mt-2 text-sm text-red-400">
                      Status: {req.status}
                    </p>
                  </div>

                  {req.status === "Pending" && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() =>
                          updateRequestStatus(req._id, "Approved")
                        }
                        className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateRequestStatus(req._id, "Rejected")
                        }
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= CASES SECTION ================= */}

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Your Cases</h2>

        {loading ? (
          <div className="text-gray-400">Loading cases...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.map((item) => (
              <div
                key={item._id}
                className="p-5 bg-[#111] rounded border border-red-600/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-semibold">
                      {item.title}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Client: {item.clientName || "N/A"}
                    </p>
                    <p className="text-red-400 text-sm mt-1">
                      Status: {item.status}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        navigate(`/case/${item._id}/workspace`)
                      }
                      className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700"
                    >
                      Open Workspace
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="px-3 py-1 bg-[#333] rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1 bg-red-700 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= ADD CASE MODAL ================= */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="p-6 bg-[#111] rounded border border-red-600/30 w-96">
            <h3 className="text-lg font-semibold mb-3">
              Create New Case
            </h3>

            <input
              placeholder="Case title"
              value={newCase.title}
              onChange={(e) =>
                setNewCase({ ...newCase, title: e.target.value })
              }
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-2 bg-[#333] rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-3 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
