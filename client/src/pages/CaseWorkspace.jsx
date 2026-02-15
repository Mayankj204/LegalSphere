// client/src/pages/CaseWorkspace.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import workspaceService from "../services/workspaceService";
import CaseHeader from "../components/CaseHeader";
import WorkspaceTabs from "../components/WorkspaceTabs";
import PageTransition from "../components/PageTransition";

import Overview from "./workspace/Overview";
import Documents from "./workspace/Documents";
import Notes from "./workspace/Notes";
import CaseAIWorkspace from "./workspace/CaseAIWorkspace";
import Timeline from "./workspace/Timeline";
import Billing from "./workspace/Billing";

export default function CaseWorkspace() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) {
      navigate("/dashboard");
      return;
    }
    loadCase();
  }, [caseId]);

  const loadCase = async () => {
    setLoading(true);
    try {
      const c = await workspaceService.getCaseById(caseId);
      setCaseData(c);
    } catch (err) {
      console.error("Failed to load case context:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border border-white/5 rounded-full" />
            <div className="absolute inset-0 border-t-2 border-red-600 rounded-full animate-spin" />
          </div>
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em] animate-pulse">
            Synchronizing Case Node
          </p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="p-12 bg-[#0A0A0A] border border-white/5 rounded-[3rem] text-center max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-red-600 text-2xl font-black">!</span>
          </div>
          <h2 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Registry Error</h2>
          <p className="text-gray-500 text-xs leading-relaxed uppercase tracking-widest">
            The requested case node is restricted or does not exist in the current secure registry.
          </p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all border border-white/5"
          >
            Return to Command Center
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 pt-20">
        
        {/* CASE IDENTITY UNIT */}
        <CaseHeader caseData={caseData} refreshCase={loadCase} />

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-10">
          
          {/* TACTICAL NAVIGATION */}
          <div className="mb-10">
            <WorkspaceTabs active={activeTab} onChange={setActiveTab} />
          </div>

          {/* DYNAMIC CONTENT ENGINE */}
          
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] shadow-2xl min-h-[65vh] relative overflow-hidden transition-all duration-700">
            
            {/* Structural Depth Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
            
            <div className="relative z-10 p-10 md:p-14 h-full">
              {activeTab === "overview" && <Overview caseData={caseData} refreshCase={loadCase} />}
              {activeTab === "documents" && <Documents caseId={caseId} />}
              {activeTab === "notes" && <Notes caseId={caseId} />}
              {activeTab === "aiworkspace" && <CaseAIWorkspace caseId={caseId} />}
              {activeTab === "timeline" && <Timeline caseId={caseId} />}
              {activeTab === "billing" && <Billing caseId={caseId} />}
            </div>
          </div>
          
          {/* SYSTEM METADATA FOOTER */}
          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 px-6 pb-12">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              <p className="text-[9px] text-gray-700 font-mono uppercase tracking-[0.5em]">
                Session_Node: {caseId?.substring(0, 16).toUpperCase()}
              </p>
            </div>
            
            <div className="flex gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-gray-800 font-black uppercase tracking-widest">Grounding Engine</span>
                <span className="text-[9px] text-gray-600 font-mono uppercase tracking-tighter">RAG_STATUS: OPTIMIZED</span>
              </div>
              <div className="flex flex-col items-end border-l border-white/5 pl-8">
                <span className="text-[8px] text-gray-800 font-black uppercase tracking-widest">Security Layer</span>
                <span className="text-[9px] text-gray-600 font-mono uppercase tracking-tighter">AES_256: ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}