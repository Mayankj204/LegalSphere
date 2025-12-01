// client/src/pages/DashboardLawyer.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLawyerCases, createCase, updateCase, deleteCase } from "../services/caseService";

export default function DashboardLawyer() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
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

  useEffect(() => {
    loadCases();
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

  const handleCreate = async () => {
    if (!newCase.title.trim()) return alert("Title required");
    try {
      await createCase(newCase);
      setShowAdd(false);
      setNewCase({ title: "", clientName: "", court: "", status: "Open", confidential: false });
      await loadCases();
    } catch (err) {
      console.error("Create case failed", err);
      alert("Failed to create case");
    }
  };

  const openEditModal = (c) => {
    setEditCase(c);
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!editCase || !editCase.title.trim()) return alert("Title required");
    try {
      await updateCase(editCase._id, {
        title: editCase.title,
        clientName: editCase.clientName,
        court: editCase.court,
        status: editCase.status,
        confidential: !!editCase.confidential,
      });
      setShowEdit(false);
      setEditCase(null);
      await loadCases();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update case");
    }
  };

  const handleDelete = async (c) => {
    if (!c) return;
    const ok = window.confirm(`Delete case "${c.title}" and all its documents? This cannot be undone.`);
    if (!ok) return;
    try {
      await deleteCase(c._id);
      await loadCases();
    } catch (err) {
      console.error("Delete case failed", err);
      alert("Failed to delete case");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
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

      {/* Top widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-5 bg-[#111] rounded border border-red-600/20">
          <p className="text-gray-400 text-sm">Active Cases</p>
          <p className="text-3xl font-bold text-red-500 mt-1">{cases.length}</p>
        </div>

        <div className="p-5 bg-[#111] rounded border border-red-600/20">
          <p className="text-gray-400 text-sm">Upcoming Hearing</p>
          <p className="text-xl mt-2">15 Jan 2025</p>
          <p className="text-xs text-gray-400 mt-1">Patiala House Court</p>
        </div>

        <div className="p-5 bg-[#111] rounded border border-red-600/20">
          <p className="text-gray-400 text-sm">AI Tools</p>
          <button onClick={() => navigate("/workspace")} className="mt-3 px-4 py-2 bg-red-600 rounded hover:bg-red-700 w-full">
            Open AI Assistant 🤖
          </button>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
        <div className="p-4 bg-[#111] rounded border border-red-600/20 space-y-3">
          <p>📄 FIR Document uploaded for Rahul Kumar (10 Dec 2024)</p>
          <p>📝 Note added for Land Dispute Case (12 Dec 2024)</p>
          <p>⚖️ Case Status Updated — Evidence Pending</p>
        </div>
      </div>

      {/* Cases grid */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Cases</h2>

        {loading ? (
          <div className="text-gray-400">Loading cases...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.map((item) => (
              <div key={item._id} className="p-5 bg-[#111] rounded border border-red-600/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-semibold">{item.title}</p>
                    <p className="text-gray-400 text-sm mt-1">Client: {item.clientName || "N/A"}</p>
                    <p className="text-gray-400 text-sm">Court: {item.court || "N/A"}</p>
                    <p className="text-red-400 text-sm mt-1">Status: {item.status}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button onClick={() => navigate(`/case/${item._id}/workspace`)} className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700">
                      Open Workspace
                    </button>

                    <button onClick={() => openEditModal(item)} className="px-3 py-1 bg-[#333] border border-red-600/40 rounded text-sm hover:bg-[#444]">
                      Edit
                    </button>

                    <button onClick={() => handleDelete(item)} className="px-3 py-1 bg-red-700 rounded text-sm hover:bg-red-800">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Case Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="p-6 bg-[#111] rounded border border-red-600/30 w-96">
            <h3 className="text-lg font-semibold mb-3">Create New Case</h3>

            <input
              placeholder="Case title"
              value={newCase.title}
              onChange={(e) => setNewCase((s) => ({ ...s, title: e.target.value }))}
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded mb-2"
            />
            <input
              placeholder="Client name"
              value={newCase.clientName}
              onChange={(e) => setNewCase((s) => ({ ...s, clientName: e.target.value }))}
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded mb-2"
            />
            <input
              placeholder="Court"
              value={newCase.court}
              onChange={(e) => setNewCase((s) => ({ ...s, court: e.target.value }))}
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded mb-2"
            />

            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm text-gray-400">Status</label>
              <select
                value={newCase.status}
                onChange={(e) => setNewCase((s) => ({ ...s, status: e.target.value }))}
                className="p-2 bg-[#0d0d0d] border border-red-600/20 rounded"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Evidence Pending</option>
                <option>Closed</option>
              </select>

              <label className="ml-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newCase.confidential}
                  onChange={(e) => setNewCase((s) => ({ ...s, confidential: e.target.checked }))}
                />
                Confidential
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-3 py-2 bg-[#333] rounded">Cancel</button>
              <button onClick={handleCreate} className="px-3 py-2 bg-red-600 rounded hover:bg-red-700">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {showEdit && editCase && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="p-6 bg-[#111] rounded border border-red-600/30 w-96">
            <h3 className="text-lg font-semibold mb-3">Edit Case</h3>

            <input
              placeholder="Case title"
              value={editCase.title}
              onChange={(e) => setEditCase((s) => ({ ...s, title: e.target.value }))}
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded mb-2"
            />
            <input
              placeholder="Client name"
              value={editCase.clientName}
              onChange={(e) => setEditCase((s) => ({ ...s, clientName: e.target.value }))}
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded mb-2"
            />
            <input
              placeholder="Court"
              value={editCase.court}
              onChange={(e) => setEditCase((s) => ({ ...s, court: e.target.value }))}
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded mb-2"
            />

            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm text-gray-400">Status</label>
              <select
                value={editCase.status}
                onChange={(e) => setEditCase((s) => ({ ...s, status: e.target.value }))}
                className="p-2 bg-[#0d0d0d] border border-red-600/20 rounded"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Evidence Pending</option>
                <option>Closed</option>
              </select>

              <label className="ml-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!editCase.confidential}
                  onChange={(e) => setEditCase((s) => ({ ...s, confidential: e.target.checked }))}
                />
                Confidential
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowEdit(false); setEditCase(null); }} className="px-3 py-2 bg-[#333] rounded">Cancel</button>
              <button onClick={handleUpdate} className="px-3 py-2 bg-red-600 rounded hover:bg-red-700">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
