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

  const [showEdit, setShowEdit] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [editFilename, setEditFilename] = useState("");
  const [editTag, setEditTag] = useState("");

  useEffect(() => {
    loadCase();
    loadDocuments();
  }, [caseId]);

  const loadCase = async () => {
    try {
      const res = await workspaceService.getCaseById(caseId);
      setCaseData(res);
    } catch (err) { console.error("Load failed:", err); }
  };

  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const docs = await workspaceService.getCaseDocuments(caseId);
      setDocuments(docs || []);
    } catch (err) { setDocuments([]); } 
    finally { setLoadingDocs(false); }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      await workspaceService.uploadCaseDocument(caseId, file);
      await loadDocuments();
    } catch (err) { alert("Upload failed"); } 
    finally { setUploading(false); }
  };

  const saveEdit = async () => {
    if (!editDoc) return;
    try {
      await workspaceService.updateCaseDocument(caseId, editDoc._id, {
        filename: editFilename,
        tag: editTag,
      });
      setShowEdit(false);
      await loadDocuments();
    } catch (err) { alert("Update failed"); }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Permanently purge "${doc.filename}" from vault?`)) return;
    try {
      await workspaceService.deleteCaseDocument(caseId, doc._id);
      await loadDocuments();
    } catch (err) { alert("Delete failed"); }
  };

  const openEditModal = (doc) => {
    setEditDoc(doc);
    setEditFilename(doc.filename);
    setEditTag(doc.tag || "");
    setShowEdit(true);
  };

  if (!caseData) return <div className="p-10 text-gray-500 font-mono text-[10px] animate-pulse uppercase tracking-[0.4em]">Establishing Secure Link...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-red-500/30 pb-20">
      
      {/* CASE MASTER STRIP */}
      <div className="relative bg-[#0A0A0A] border-b border-white/5 p-8 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">{caseData.title}</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] font-mono uppercase tracking-[0.2em] text-gray-600">
            <span className="text-slate-400">CLIENT: {caseData.clientName || caseData.clientId}</span>
            <span className="text-gray-800">/</span>
            <span className={`font-bold ${caseData.status === 'Closed' ? 'text-gray-500' : 'text-red-500 animate-pulse'}`}>STATUS: {caseData.status}</span>
            <span className="text-gray-800">/</span>
            <span className="text-gray-500 font-bold">CASE_REF: #{caseId.substring(0, 8).toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {caseData.confidential && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-red-600/5 border border-red-600/30 rounded-xl">
              <div className="w-1 h-1 bg-red-600 rounded-full animate-ping" />
              <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">Restricted Access</span>
            </div>
          )}
          <button 
            onClick={() => navigate(`/case/${caseId}/workspace`)}
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-600/20 active:scale-95"
          >
            Launch Case Node
          </button>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-8 md:px-12 py-12 grid lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: EVIDENCE VAULT */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Discovery Vault</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Immutable Evidence Storage for RAG-Analysis</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-white/5 border border-white/10 hover:border-red-600/50 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-gray-400 hover:text-white shadow-lg">
                {uploading ? "Encrypting..." : "Add Evidence Node"}
                <input type="file" accept=".pdf,.txt,.doc,.docx" className="hidden" onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])} />
              </label>
              <button onClick={loadDocuments} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-red-500 transition-colors shadow-lg">↻</button>
            </div>
          </div>

          {loadingDocs ? (
            <div className="py-32 text-center font-mono text-[10px] text-gray-700 uppercase tracking-[0.5em] animate-pulse">Syncing Cryptographic Vault...</div>
          ) : documents.length === 0 ? (
            <div className="py-32 text-center border border-dashed border-white/5 rounded-[3rem] text-gray-700 text-xs uppercase tracking-[0.4em]">No Discovery Material Detected</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.map((doc) => (
                <div key={doc._id} className="group relative bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 hover:bg-[#0F0F0F] hover:border-red-600/30 transition-all duration-500 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/[0.02] blur-[60px] rounded-full group-hover:bg-red-600/10 transition-all" />
                  
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 font-mono text-[10px] font-bold border border-red-600/20 uppercase tracking-tighter">Node</div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-red-500 transition-colors truncate w-40">{doc.filename}</p>
                        <p className="text-[8px] text-gray-600 font-mono mt-1 uppercase">{new Date(doc.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    {doc.tag && (
                      <span className="text-[8px] px-3 py-1 bg-red-600/10 text-red-500 border border-red-600/20 rounded-lg uppercase font-black tracking-widest">
                        {doc.tag}
                      </span>
                    )}
                  </div>

                  {doc.summary && (
                    <div className="mb-8 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <p className="text-[8px] uppercase font-black text-gray-700 mb-3 tracking-widest border-b border-white/5 pb-2">AI Neural Summary</p>
                      <p className="text-xs text-gray-400 leading-relaxed italic line-clamp-3">{doc.summary}</p>
                    </div>
                  )}

                  <div className="relative z-10 flex gap-6 pt-6 border-t border-white/5">
                    <a href={doc.storageUrl} target="_blank" rel="noreferrer" className="text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-[0.2em] transition-colors">Access File</a>
                    <button onClick={() => openEditModal(doc)} className="text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-[0.2em] transition-colors">Metadata</button>
                    <button onClick={() => handleDelete(doc)} className="text-[9px] font-black text-red-900/40 hover:text-red-500 uppercase tracking-[0.2em] ml-auto transition-colors">Purge Node</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CASE METRICS & TOOLS */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-[40px] text-white/[0.02] font-black select-none uppercase">ID</div>
             <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">Session Parameters</h3>
             <div className="space-y-6">
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-700 block mb-1">Assigned Jurisdiction</label>
                  <p className="text-sm text-white font-medium">{caseData.court || "UNSPECIFIED"}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-700 block mb-1">Data Volume</label>
                  <p className="text-sm text-white font-medium font-mono">{documents.length} Evidence Nodes</p>
                </div>
                <div>
                   <label className="text-[9px] uppercase font-bold text-gray-700 block mb-1">Security Level</label>
                   <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{caseData.confidential ? "RESTRICTED (AES_256)" : "STANDARD"}</span>
                </div>
             </div>
          </div>

          <div className="p-8 bg-red-600/5 border border-red-600/10 rounded-[2.5rem] text-center">
            <p className="text-xs text-gray-500 font-medium mb-4 italic">"Proprietary AI Synthesis ready for cross-referencing."</p>
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">Export Analysis Brief</button>
          </div>
        </aside>
      </main>

      {/* EDIT OVERLAY */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
          <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-sm rounded-[3rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-light text-white mb-10 tracking-tighter uppercase">Modify Metadata</h3>
            <div className="space-y-8">
              <div>
                <label className="text-[9px] uppercase font-black text-gray-600 mb-2 block ml-1 tracking-[0.2em]">Archive Identifier</label>
                <input className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:border-red-600 outline-none transition-all" value={editFilename} onChange={(e) => setEditFilename(e.target.value)} />
              </div>
              <div>
                <label className="text-[9px] uppercase font-black text-gray-600 mb-2 block ml-1 tracking-[0.2em]">Security Protocol</label>
                <select value={editTag} onChange={(e) => setEditTag(e.target.value)} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:border-red-600 outline-none appearance-none">
                  <option value="">UNCLASSIFIED</option>
                  {TAG_OPTIONS.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-12 flex flex-col gap-3">
              <button onClick={saveEdit} className="w-full py-4 bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 shadow-xl shadow-red-600/20 transition-all">Commit Changes</button>
              <button onClick={() => setShowEdit(false)} className="w-full py-4 text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-[0.2em]">Discard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}