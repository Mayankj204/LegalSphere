// client/src/pages/workspace/Documents.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../../services/workspaceService";
import { BACKEND_URL } from "../../config";

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
    // eslint-disable-next-line
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
    }
  };

  const handleDelete = async (doc) => {
    if (!doc) return;
    const ok = window.confirm(`Permanently delete "${doc.filename}" from the vault?`);
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
    <div className="bg-[#050505] text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full" />
            Evidence Vault
          </h2>
          <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-tighter">Secure Document Repository</p>
        </div>

        <label className="cursor-pointer bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-600/10 active:scale-95">
          {uploading ? "Encrypting..." : "Upload Document"}
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
          />
        </label>
      </div>

      {/* DOCUMENT REPOSITORY GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loadingDocs ? (
          <div className="col-span-full py-20 text-center font-mono text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">
            Accessing Encrypted Storage...
          </div>
        ) : documents.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-3xl text-gray-600 text-xs uppercase tracking-[0.3em]">
            Vault is empty. No evidence uploaded.
          </div>
        ) : (
          documents.map((doc) => {
            const fileUrl = doc.storageUrl.startsWith("http")
              ? doc.storageUrl
              : `${BACKEND_URL}${doc.storageUrl}`;

            return (
              <div key={doc._id} className="group bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:bg-[#0F0F0F] hover:border-red-600/20 transition-all duration-300 relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-red-600/10 rounded-lg flex items-center justify-center text-red-500 text-xs">
                        DOC
                      </div>
                      <p className="font-semibold text-white group-hover:text-red-500 transition-colors truncate w-48 lg:w-64">
                        {doc.filename}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {doc.tag && (
                        <span className="text-[9px] px-2 py-0.5 bg-red-600/10 border border-red-600/20 text-red-500 rounded uppercase font-black tracking-tighter">
                          {doc.tag}
                        </span>
                      )}
                      <p className="text-[9px] text-gray-600 font-mono uppercase">
                        {new Date(doc.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button onClick={() => window.open(fileUrl, "_blank")} className="text-[10px] uppercase font-bold text-gray-400 hover:text-white transition-colors">View</button>
                    <button onClick={() => downloadFile(fileUrl, doc.filename)} className="text-[10px] uppercase font-bold text-blue-500/70 hover:text-blue-400 transition-colors">Fetch</button>
                    <button onClick={() => openEditModal(doc)} className="text-[10px] uppercase font-bold text-gray-600 hover:text-gray-400 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(doc)} className="text-[10px] uppercase font-bold text-red-900/60 hover:text-red-500 transition-colors">Purge</button>
                  </div>
                </div>

                {doc.summary && (
                  <div className="mt-5 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-[9px] uppercase font-black text-gray-600 mb-2 tracking-widest">AI Intelligence Synthesis:</p>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 italic">
                      {doc.summary}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* EDIT MODAL - Professional Overlay */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-light text-white mb-8">Modify Metadata</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block ml-1">Archive Filename</label>
                <input
                  className="w-full p-3 bg-black border border-white/5 rounded-xl text-sm text-white focus:border-red-600 outline-none"
                  value={editFilename}
                  onChange={(e) => setEditFilename(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block ml-1">Classification Tag</label>
                <select
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  className="w-full p-3 bg-black border border-white/5 rounded-xl text-sm text-white focus:border-red-600 outline-none"
                >
                  <option value="">Unclassified</option>
                  {TAG_OPTIONS.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-3">
              <button onClick={() => setShowEdit(false)} className="px-4 py-2 text-xs text-gray-500 hover:text-white transition-colors">Discard</button>
              <button onClick={saveEdit} className="px-6 py-2 bg-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-12 text-center text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">
        Verified Cryptographic Storage Node | LegalSphere V2
      </p>
    </div>
  );
}