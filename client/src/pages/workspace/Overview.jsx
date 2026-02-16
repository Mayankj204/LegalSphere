// client/src/pages/workspace/Overview.jsx
import React, { useState, useEffect } from "react";
import workspaceService from "../../services/workspaceService";

export default function Overview({ caseData, refreshCase }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    court: "",
    status: "Open",
    quickNotes: "",
  });

  /* ===================== Sync Data ===================== */
  useEffect(() => {
    if (caseData) {
      setFormData({
        title: caseData.title || "",
        clientName: caseData.clientId?.name || "",
        court: caseData.court || "",
        status: caseData.status || "Open",
        quickNotes: caseData.quickNotes || "",
      });
    }
  }, [caseData]);

  /* ===================== Update Handler ===================== */
  const handleUpdate = async () => {
    try {
      if (!caseData?._id) return;

      setIsSaving(true);

      // 1️⃣ Update case fields
      await workspaceService.updateCase(caseData._id, {
        title: formData.title,
        court: formData.court,
        status: formData.status,
        quickNotes: formData.quickNotes,
      });

      // 2️⃣ Update client name (only if changed & exists)
      if (
        caseData.clientId?._id &&
        formData.clientName &&
        formData.clientName !== caseData.clientId?.name
      ) {
        await workspaceService.updateUser(
          caseData.clientId._id,
          { name: formData.clientName }
        );
      }

      setIsEditing(false);
      refreshCase();

    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update case info");
    } finally {
      setIsSaving(false);
    }
  };

  /* ===================== Input Change ===================== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ===================== Status Badge ===================== */
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Closed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-slate-200">

      {/* ===================== Header ===================== */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Case Overview
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage core details and case metadata
          </p>
        </div>

        <div className="flex gap-3">
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm transition"
              disabled={isSaving}
            >
              Cancel
            </button>
          )}

          <button
            onClick={() => (isEditing ? handleUpdate() : setIsEditing(true))}
            disabled={isSaving}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
              isEditing
                ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30"
            } ${isSaving ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Case"}
          </button>
        </div>
      </div>

      {/* ===================== Main Card ===================== */}
      <div className="bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-8 rounded-2xl border border-gray-800 shadow-2xl space-y-8">

        {/* Case Title */}
        <div>
          <label className="block text-sm mb-2 text-gray-400 uppercase tracking-wide">
            Case Title
          </label>
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          ) : (
            <p className="text-xl font-semibold">{formData.title || "-"}</p>
          )}
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Client Name */}
          <div>
            <label className="block text-sm mb-2 text-gray-400 uppercase tracking-wide">
              Client Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            ) : (
              <p>{formData.clientName || "-"}</p>
            )}
          </div>

          {/* Court */}
          <div>
            <label className="block text-sm mb-2 text-gray-400 uppercase tracking-wide">
              Court / Jurisdiction
            </label>
            {isEditing ? (
              <input
                type="text"
                name="court"
                value={formData.court}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            ) : (
              <p>{formData.court || "-"}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm mb-2 text-gray-400 uppercase tracking-wide">
            Status
          </label>
          {isEditing ? (
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          ) : (
            <span
              className={`inline-block px-4 py-1 text-sm rounded-full border ${getStatusColor(
                formData.status
              )}`}
            >
              {formData.status}
            </span>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm mb-2 text-gray-400 uppercase tracking-wide">
            Notes
          </label>
          {isEditing ? (
            <textarea
              name="quickNotes"
              value={formData.quickNotes}
              onChange={handleChange}
              rows="5"
              className="w-full p-4 rounded-lg bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            />
          ) : (
            <div className="bg-black/40 p-4 rounded-lg border border-gray-800 text-gray-300">
              {formData.quickNotes || "No notes added yet."}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
