// client/src/components/CaseDocumentCard.jsx
import React, { useState } from "react";
import workspaceService from "../services/workspaceService";
import { BACKEND_URL } from "../config";

export default function CaseDocumentCard({ doc, caseId, refresh }) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState(doc.filename);
  const [newTag, setNewTag] = useState(doc.tag || "");

  const TAGS = ["Evidence", "FIR", "Contract", "Notes", "Court Order", "Other"];

  const fileUrl = doc.storageUrl.startsWith("http")
    ? doc.storageUrl
    : `${BACKEND_URL}${doc.storageUrl}`;

  const saveChanges = async () => {
    try {
      await workspaceService.updateCaseDocument(caseId, doc._id, {
        filename: newName,
        tag: newTag,
      });
      setOpen(false);
      refresh();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const removeDoc = async () => {
    if (window.confirm(`Permanently purge "${doc.filename}" from the vault?`)) {
      try {
        await workspaceService.deleteCaseDocument(caseId, doc._id);
        refresh();
      } catch (err) {
        console.error("Purge failed:", err);
      }
    }
  };

  const downloadFile = () => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = doc.filename;
    a.click();
  };

  return (
    <div className="group bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:bg-[#0F0F0F] hover:border-red-600/20 transition-all duration-300 relative overflow-hidden">
      
      {/* CARD CONTENT */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-red-600/10 rounded-lg flex items-center justify-center text-red-500 font-mono text-[10px] border border-red-600/20">
                PDF
              </div>
              <h3 className="font-semibold text-white group-hover:text-red-500 transition-colors truncate max-w-[200px]">
                {doc.filename}
              </h3>
            </div>
            
            <div className="flex items-center gap-3">
              {doc.tag && (
                <span className="text-[9px] px-2 py-0.5 bg-red-600/10 border border-red-600/20 text-red-500 rounded uppercase font-black tracking-tighter">
                  {doc.tag}
                </span>
              )}
              <p className="text-[9px] text-gray-600 font-mono uppercase">
                {new Date(doc.createdAt || doc.uploadedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* QUICK ACTIONS ICON BAR */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => window.open(fileUrl, "_blank")} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all" title="View">
              👁️
            </button>
            <button onClick={downloadFile} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all" title="Download">
              📥
            </button>
            <button onClick={() => setOpen(true)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all" title="Edit">
              ✏️
            </button>
            <button onClick={removeDoc} className="p-2 bg-red-900/10 hover:bg-red-600 rounded-lg text-red-600 hover:text-white transition-all" title="Delete">
              🗑️
            </button>
          </div>
        </div>

        {/* AI SUMMARY SECTION */}
        {doc.summary && (
          <div className="mt-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <p className="text-[8px] uppercase font-black text-gray-600 mb-2 tracking-[0.2em]">AI Synthesis</p>
            <p className="text-xs text-gray-400 leading-relaxed italic line-clamp-3">
              {doc.summary}
            </p>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
          <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-light text-white mb-8 tracking-tight">Modify Metadata</h3>

            <div className="space-y-6">
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block ml-1">Archive Filename</label>
                <input
                  className="w-full p-3 bg-black border border-white/5 rounded-xl text-sm text-white focus:border-red-600 outline-none transition-all"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block ml-1">Classification Tag</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full p-3 bg-black border border-white/5 rounded-xl text-sm text-white focus:border-red-600 outline-none transition-all cursor-pointer"
                >
                  <option value="">Unclassified</option>
                  {TAGS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-3">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-xs text-gray-500 hover:text-white transition-colors">Discard</button>
              <button onClick={saveChanges} className="px-6 py-2 bg-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500 active:scale-95 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}