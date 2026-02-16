// client/src/pages/workspace/Documents.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../../services/workspaceService";
import { BACKEND_URL } from "../../config";

export default function Documents({ caseId }) {
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [editFilename, setEditFilename] = useState("");
  const [editTag, setEditTag] = useState("");

  const TAG_OPTIONS = ["Evidence", "FIR", "Contract", "Notes", "Court Order", "Other"];

  useEffect(() => {
    if (caseId) loadDocs();
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
      await loadDocs();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (doc) => {
    if (!doc) return;
    const ok = window.confirm(`Delete "${doc.filename}" permanently?`);
    if (!ok) return;
    try {
      await workspaceService.deleteCaseDocument(caseId, doc._id);
      await loadDocs();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const downloadFile = (url, filename) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-slate-200">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Documents</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage all files related to this case
          </p>
        </div>

        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md text-sm font-medium transition">
          {uploading ? "Uploading..." : "Upload File"}
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
            onChange={(e) =>
              e.target.files[0] && handleUpload(e.target.files[0])
            }
          />
        </label>
      </div>

      {/* Document List */}
      {loadingDocs ? (
        <div className="text-center py-20 text-gray-400">
          Loading documents...
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-700 rounded-xl text-gray-500">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="grid gap-5">
          {documents.map((doc) => {
            const fileUrl = doc.storageUrl.startsWith("http")
              ? doc.storageUrl
              : `${BACKEND_URL}${doc.storageUrl}`;

            return (
              <div
                key={doc._id}
                className="bg-[#141414] hover:bg-[#1b1b1b] transition border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
              >
                {/* Left Side */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {doc.filename}
                  </h3>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400 flex-wrap">
                    {doc.tag && (
                      <span className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full">
                        {doc.tag}
                      </span>
                    )}
                    <span>
                      Uploaded on{" "}
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {doc.summary && (
                    <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                      {doc.summary}
                    </p>
                  )}
                </div>

                {/* Right Side Actions */}
                <div className="flex gap-3 flex-wrap text-sm">
                  <button
                    onClick={() => window.open(fileUrl, "_blank")}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md"
                  >
                    View
                  </button>

                  <button
                    onClick={() => downloadFile(fileUrl, doc.filename)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md"
                  >
                    Download
                  </button>

                  <button
                    onClick={() => openEditModal(doc)}
                    className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded-md"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(doc)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] w-full max-w-md rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-6">Edit Document</h3>

            <div className="space-y-4">
              <input
                className="w-full p-3 bg-black border border-gray-700 rounded-md text-white focus:border-blue-500 outline-none"
                value={editFilename}
                onChange={(e) => setEditFilename(e.target.value)}
              />

              <select
                value={editTag}
                onChange={(e) => setEditTag(e.target.value)}
                className="w-full p-3 bg-black border border-gray-700 rounded-md text-white focus:border-blue-500 outline-none"
              >
                <option value="">Select tag</option>
                {TAG_OPTIONS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
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
