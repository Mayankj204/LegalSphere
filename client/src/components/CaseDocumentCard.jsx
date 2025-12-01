// client/src/components/CaseDocumentCard.jsx
import React, { useState } from "react";
import workspaceService from "../services/workspaceService";
import { BACKEND_URL } from "../config"; // backend base URL

export default function CaseDocumentCard({ doc, caseId, refresh }) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState(doc.filename);
  const [newTag, setNewTag] = useState(doc.tag || "");

  const TAGS = ["Evidence", "FIR", "Contract", "Notes", "Court Order", "Other"];

  // full backend file URL
  const fileUrl = doc.storageUrl.startsWith("http")
    ? doc.storageUrl
    : `${BACKEND_URL}${doc.storageUrl}`;

  const saveChanges = async () => {
    await workspaceService.updateCaseDocument(caseId, doc._id, {
      filename: newName,
      tag: newTag,
    });
    setOpen(false);
    refresh();
  };

  const removeDoc = async () => {
    if (window.confirm(`Delete ${doc.filename}?`)) {
      await workspaceService.deleteCaseDocument(caseId, doc._id);
      refresh();
    }
  };

  const downloadFile = () => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = doc.filename;
    a.click();
  };

  return (
    <div className="p-3 bg-[#111] rounded border border-red-600/20">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{doc.filename}</p>

          {doc.tag && (
            <span className="text-xs px-2 py-1 mt-1 inline-block bg-red-700/20 border border-red-600/40 rounded">
              {doc.tag}
            </span>
          )}

          <p className="text-sm text-gray-400">
            {new Date(doc.createdAt || doc.uploadedAt).toLocaleString()}
          </p>
        </div>

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
            onClick={downloadFile}
            className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700"
          >
            Download
          </button>

          {/* EDIT */}
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-1 bg-[#333] border border-red-600/40 rounded text-sm hover:bg-[#444]"
          >
            Edit
          </button>

          {/* DELETE */}
          <button
            onClick={removeDoc}
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

      {/* EDIT MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="p-6 bg-[#111] rounded border border-red-600/30 w-80">
            <h3 className="text-lg font-semibold mb-3">Edit Document</h3>

            <input
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded text-white mb-3"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <select
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-full p-2 bg-[#0d0d0d] border border-red-600/20 rounded text-white mb-3"
            >
              <option value="">Select Tag</option>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 bg-[#333] rounded hover:bg-[#444]"
              >
                Cancel
              </button>

              <button
                onClick={saveChanges}
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
