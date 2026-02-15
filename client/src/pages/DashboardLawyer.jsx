import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getLawyerCases,
  createCase,
  deleteCase,
} from "../services/caseService";

export default function DashboardLawyer() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [cases, setCases] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [newCase, setNewCase] = useState({ title: "" });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadCases();
    loadRequests();
    loadNotifications();
    // eslint-disable-next-line
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const data = await getLawyerCases();
      setCases(data || []);
    } catch {
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/requests/lawyer",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data || []);
    } catch {
      console.error("Failed to load requests");
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(res.data || []);
    } catch {
      console.error("Failed to load notifications");
    }
  };

  /* ================= FILTER LOGIC ================= */

  const filteredNotifications = useMemo(() => {
    if (filter === "Unread")
      return notifications.filter((n) => !n.isRead);

    if (filter === "Approved")
      return notifications.filter((n) =>
        n.message.toLowerCase().includes("approved")
      );

    if (filter === "Rejected")
      return notifications.filter((n) =>
        n.message.toLowerCase().includes("rejected")
      );

    return notifications;
  }, [notifications, filter]);

  const getNotificationIcon = (n) => {
    if (n.message.toLowerCase().includes("approved")) return "🟢";
    if (n.message.toLowerCase().includes("rejected")) return "🔴";
    return "📢";
  };

  /* ================= MARK ALL READ ================= */

  const markAllRead = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/notifications/mark-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadNotifications();
    } catch {
      alert("Failed to mark notifications");
    }
  };

  /* ================= APPROVE / REJECT ================= */

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      loadRequests();
      loadNotifications();
    } catch {
      alert("Failed to update request");
    }
  };

  /* ================= CREATE / DELETE CASE ================= */

  const handleCreate = async () => {
    if (!newCase.title.trim()) return alert("Title required");
    try {
      await createCase(newCase);
      setShowAdd(false);
      setNewCase({ title: "" });
      loadCases();
    } catch {
      alert("Failed to create case");
    }
  };

  const handleDelete = async (c) => {
    const ok = window.confirm(`Delete case "${c.title}"?`);
    if (!ok) return;

    try {
      await deleteCase(c._id);
      loadCases();
    } catch {
      alert("Failed to delete case");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, Lawyer 👨‍⚖️</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          + Add New Case
        </button>
      </div>

      {/* ================= CONSULTATION REQUESTS ================= */}

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">📩 Consultation Requests</h2>

        {requests.length === 0 ? (
          <div className="p-4 bg-[#111] rounded border border-red-600/20">
            No consultation requests.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="p-5 bg-[#111] rounded border border-red-600/30"
              >
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

                {req.status === "Pending" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        updateRequestStatus(req._id, "Approved")
                      }
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateRequestStatus(req._id, "Rejected")
                      }
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= NOTIFICATION HISTORY ================= */}

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">🔔 Notification History</h2>

          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#111] border border-red-600/30 px-3 py-1 rounded"
            >
              <option>All</option>
              <option>Unread</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            <button
              onClick={markAllRead}
              className="px-4 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
            >
              Mark All Read
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="p-4 bg-[#111] rounded border border-red-600/20">
            No notifications found.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 rounded border ${
                  n.isRead
                    ? "bg-[#111] border-red-600/10"
                    : "bg-red-600/10 border-red-600/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    {getNotificationIcon(n)}
                  </span>

                  <div>
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= CASES ================= */}

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">
          📁 Your Cases ({cases.length})
        </h2>

        {loading ? (
          <div className="text-gray-400">Loading cases...</div>
        ) : cases.length === 0 ? (
          <div className="p-6 bg-[#111] rounded-xl border border-red-600/20 text-center text-gray-400">
            No cases found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cases.map((item) => (
              <div
                key={item._id}
                className="bg-[#111] border border-red-600/20 rounded-xl p-6 shadow-md"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {item.title}
                </h3>

                <button
                  onClick={() =>
                    navigate(`/case/${item._id}/workspace`)
                  }
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
                >
                  Open Workspace
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  className="mt-2 w-full bg-red-800 hover:bg-red-900 px-3 py-2 rounded text-sm"
                >
                  Delete Case
                </button>
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
                setNewCase({ title: e.target.value })
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
