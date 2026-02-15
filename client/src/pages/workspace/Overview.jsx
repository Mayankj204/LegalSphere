// client/src/pages/workspace/Overview.jsx
import React, { useState } from "react";
import workspaceService from "../../services/workspaceService";

export default function Overview({ caseData, refreshCase }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: caseData.title || "",
    clientName: caseData.clientName || "",
    court: caseData.court || "",
    status: caseData.status || "Open",
    quickNotes: caseData.quickNotes || ""
  });

  const handleUpdate = async () => {
    try {
      await workspaceService.updateCase(caseData._id, formData);
      setIsEditing(false);
      refreshCase(); // Refresh the parent data
    } catch (err) {
      alert("Failed to update case info");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open": return "bg-green-500";
      case "closed": return "bg-gray-700";
      default: return "bg-red-600"; // In Progress / Active
    }
  };

  return (
    <div className="bg-transparent text-slate-200 animate-fade-in">
      
      {/* SECTION HEADER */}
      <div className="flex justify-between items-center mb-10 px-1">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full" />
            Case Summary & Details
          </h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase">Manage and update core case information</p>
        </div>
        
        <button 
          onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isEditing ? "bg-green-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          {isEditing ? "Save Changes" : "Edit Info"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PRIMARY INFO CARD */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-10 bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest block mb-2">Case Title / Name</label>
                {isEditing ? (
                  <input 
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-red-600 outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                ) : (
                  <p className="text-2xl font-bold text-white tracking-tight">{caseData.title}</p>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest block mb-2">Who is the Client?</label>
                {isEditing ? (
                  <input 
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-red-600 outline-none text-sm"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-gray-300">{caseData.clientName || "No client name assigned"}</p>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest block mb-2">Court / Jurisdiction</label>
                {isEditing ? (
                  <input 
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-red-600 outline-none text-sm"
                    value={formData.court}
                    onChange={(e) => setFormData({...formData, court: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-gray-300">{caseData.court || "Not assigned to a court yet"}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest block mb-3">Case Status</label>
                {isEditing ? (
                  <select 
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-red-600 outline-none text-sm appearance-none"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Open">Open (Active)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed / Archived</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${getStatusColor(caseData.status)} transition-all duration-1000 w-[60%]`} />
                    </div>
                    <span className="text-[10px] font-bold text-red-500 uppercase">{caseData.status}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STRATEGY NOTES */}
          <div className="p-8 bg-[#0A0A0A] border border-white/5 rounded-[2rem]">
            <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest block mb-4">Legal Strategy & Quick Notes</label>
            {isEditing ? (
              <textarea 
                rows="4"
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-red-600 outline-none text-sm resize-none"
                value={formData.quickNotes}
                onChange={(e) => setFormData({...formData, quickNotes: e.target.value})}
                placeholder="Briefly describe the strategy for this case..."
              />
            ) : (
              <p className="text-sm text-gray-400 leading-relaxed italic">
                {caseData.quickNotes ? `"${caseData.quickNotes}"` : "No specific strategy notes have been added yet."}
              </p>
            )}
          </div>
        </div>

        {/* SIDEBAR TOOLS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 bg-[#0A0A0A] border border-white/5 rounded-[2rem] shadow-2xl">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-3">Next Steps</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                <p className="text-[11px] text-gray-300">Prepare Evidence for AI Node</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                <p className="text-[11px] text-gray-500 line-through">Establish Client Session</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-red-600/5 border border-red-600/10 rounded-[2rem] text-center">
            <p className="text-[10px] text-gray-500 font-medium mb-4 uppercase tracking-widest">Counsel Protection</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              This case is encrypted with AES-256. Only authorized collaborators can view or edit these details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}