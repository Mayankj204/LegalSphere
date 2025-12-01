// client/src/pages/workspace/Documents.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../../services/workspaceService";
import { BACKEND_URL } from "../../config";   // backend base url

export default function Documents({ caseId }) {
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [editFilename, setEditFilename] = useState("");
  const [editTag, setEditTag] = useState("");

  const TAG_OPTIONS = ["Evidence", "FIR", "Contract", "Notes", "Court Order", "Other"];

  useEffect(() => {
    loadDocs();
  }, [caseId]);

  const loadDocs = async () => {
    setLoadingDocs(true);
    try {
      const docs = await workspaceService.getCaseDocuments(caseId);
      setDocuments(docs || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      await workspaceService.uploadCaseDocument(caseId, file);
      await loadDocs();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (doc) => {
    setEditDoc(doc);
    setEditFilename(doc.filename);
    setEditTag(doc.tag || "");
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!editDoc) return;
    try {
      await workspaceService.updateCaseDocument(caseId, editDoc._id, {
        filename: editFilename,
        tag: editTag,
      });
      setShowEdit(false);
      setEditDoc(null);
      await loadDocs();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update");
    }
  };

  const handleDelete = async (doc) => {
    if (!doc) return;

    const ok = window.confirm(`Delete "${doc.filename}"?`);
    if (!ok) return;

    try {
      await workspaceService.deleteCaseDocument(caseId, doc._id);
      await loadDocs();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  // DOWNLOAD BUTTON LOGIC
  const downloadFile = (url, filename) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Documents</h2>

        <label className="cursor-pointer bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2">
          {uploading ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
          />
        </label>
      </div>

      {/* DOCUMENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loadingDocs && <div className="text-gray-400">Loading...</div>}

        {!loadingDocs && documents.length === 0 && (
          <div className="text-gray-400">No documents yet.</div>
        )}

        {documents.map((doc) => {
          // Always build correct backend URL
          const fileUrl = doc.storageUrl.startsWith("http")
            ? doc.storageUrl
            : `${BACKEND_URL}${doc.storageUrl}`;

          return (
            <div key={doc._id} className="p-3 bg-[#111] rounded border border-red-600/20">
              <div className="flex justify-between items-start">
                {/* INFO */}
                <div>
                  <p className="font-semibold text-white">{doc.filename}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {doc.tag && (
                      <span className="text-xs px-2 py-1 bg-red-700/20 border border-red-600/30 rounded">
                        {doc.tag}
                      </span>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(doc.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* BUTTON GROUP */}
                <div className="flex flex-col gap-2">
                  {/* VIEW */}
                  <button
                    onClick={() => window.open(fileUrl, "_blank")}
                    className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700"
                  >
                    View
                  </button>

                  {/* DOWNLOAD */}
                  <button
                    onClick={() => downloadFile(fileUrl, doc.filename)}
                    className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700"
                  >
                    Download
                  </button>

                  {/* EDIT */}
                  <button
                    onClick={() => openEditModal(doc)}
                    className="px-3 py-1 bg-[#333] border border-red-600/40 rounded text-sm hover:bg-[#444]"
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(doc)}
                    className="px-3 py-1 bg-red-700 rounded text-sm hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* SUMMARY */}
              {doc.summary && (
                <p className="mt-3 text-gray-300 text-sm whitespace-pre-wrap">
                  <strong>Summary:</strong> {doc.summary}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="p-6 bg-[#111] rounded border border-red-600/30 w-80">
            <h3 className="text-lg font-semibold mb-3">Edit Document</h3>

            <label className="text-xs text-gray-400">Filename</label>
            <input
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded text-white mb-3"
              value={editFilename}
              onChange={(e) => setEditFilename(e.target.value)}
            />

            <label className="text-xs text-gray-400">Tag</label>
            <select
              value={editTag}
              onChange={(e) => setEditTag(e.target.value)}
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded text-white mb-4"
            >
              <option value="">Select Tag</option>
              {TAG_OPTIONS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEdit(false)}
                className="px-3 py-2 bg-[#333] rounded hover:bg-[#444]"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
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
