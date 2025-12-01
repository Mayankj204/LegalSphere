// client/src/pages/CaseDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import workspaceService from "../services/workspaceService";

const TAG_OPTIONS = ["Evidence", "FIR", "Contract", "Notes", "Court Order", "Other"];

export default function CaseDetails() {
  const { id: caseId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Rename / Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [editFilename, setEditFilename] = useState("");
  const [editTag, setEditTag] = useState("");

  useEffect(() => {
    loadCase();
    loadDocuments();
    // eslint-disable-next-line
  }, [caseId]);

  const loadCase = async () => {
    try {
      const res = await workspaceService.getCaseById(caseId);
      setCaseData(res);
    } catch (err) {
      console.error("Failed to load case:", err);
    }
  };

  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const docs = await workspaceService.getCaseDocuments(caseId);
      setDocuments(docs || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
      setDocuments([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      await workspaceService.uploadCaseDocument(caseId, file);
      await loadDocuments();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (doc) => {
    setEditDoc(doc);
    setEditFilename(doc.filename || "");
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
      await loadDocuments();
    } catch (err) {
      console.error("Failed to update document:", err);
      alert("Update failed");
    }
  };

  const handleDelete = async (doc) => {
    if (!doc) return;
    const ok = window.confirm(`Delete document "${doc.filename}"? This cannot be undone.`);
    if (!ok) return;
    try {
      await workspaceService.deleteCaseDocument(caseId, doc._id);
      await loadDocuments();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  if (!caseData) {
    return (
      <div className="p-6">
        <div className="text-gray-400">Loading case...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* CASE HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">{caseData.title}</h1>
          <p className="text-gray-300">
            <strong>Client:</strong> {caseData.clientName || caseData.clientId}
          </p>
          <p className="text-gray-300">
            <strong>Status:</strong> {caseData.status}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Court:</strong> {caseData.court || "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {caseData.confidential && (
            <span className="px-3 py-1 bg-red-700/20 text-red-300 rounded text-sm border border-red-600/30">
              Confidential
            </span>
          )}

          <button
            onClick={() => navigate(`/case/${caseId}/workspace`)}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Open Workspace
          </button>
        </div>
      </div>

      {/* DOCUMENT MANAGEMENT */}
      <div className="p-4 bg-[#0f0f0f] rounded border border-red-600/30 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Case Documents</h2>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2">
              {uploading ? "Uploading..." : "Upload Document"}
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
                onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
              />
            </label>

            <button
              onClick={loadDocuments}
              className="px-3 py-2 bg-[#111] rounded border border-red-600/20 text-sm hover:bg-[#222]"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Document list */}
        <div className="mt-6 space-y-3">
          {loadingDocs && <div className="text-gray-400">Loading documents...</div>}

          {!loadingDocs && documents.length === 0 && (
            <div className="text-gray-400">No documents uploaded yet.</div>
          )}

          {!loadingDocs &&
            documents.map((doc) => (
              <div
                key={doc._id}
                className="p-3 bg-[#111] rounded border border-red-600/20 flex flex-col"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">{doc.filename}</p>

                    <div className="mt-1 flex items-center gap-2">
                      {doc.tag && (
                        <span className="text-xs px-2 py-1 bg-red-700/20 border border-red-600/30 rounded">
                          {doc.tag}
                        </span>
                      )}

                      <p className="text-xs text-gray-400">
                        {new Date(doc.createdAt || doc.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={doc.storageUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700"
                    >
                      View
                    </a>

                    <button
                      onClick={() => openEditModal(doc)}
                      className="px-3 py-1 bg-[#333] border border-red-600/40 rounded text-sm hover:bg-[#444]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(doc)}
                      className="px-3 py-1 bg-red-700 rounded text-sm hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {doc.summary && (
                  <p className="mt-3 text-gray-300 text-sm">
                    <strong>Summary:</strong> {doc.summary}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* EDIT / RENAME MODAL */}
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
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEdit(false);
                  setEditDoc(null);
                }}
                className="px-3 py-2 bg-[#333] rounded hover:bg-[#444]"
              >
                Cancel
              </button>

              <button onClick={saveEdit} className="px-3 py-2 bg-red-600 rounded hover:bg-red-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
