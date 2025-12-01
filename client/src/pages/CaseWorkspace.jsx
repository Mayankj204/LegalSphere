import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import workspaceService from "../services/workspaceService";
import CaseHeader from "../components/CaseHeader";
import WorkspaceTabs from "../components/WorkspaceTabs";
import Overview from "./workspace/Overview";
import Documents from "./workspace/Documents";
import Notes from "./workspace/Notes";
import AITools from "./workspace/AITools";
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
    // eslint-disable-next-line
  }, [caseId]);

  const loadCase = async () => {
    setLoading(true);
    try {
      const c = await workspaceService.getCaseById(caseId);
      setCaseData(c);
    } catch (err) {
      console.error("Failed to load case", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading case...</div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-400">Case not found or you are not authorized.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <CaseHeader caseData={caseData} refreshCase={loadCase} />
      <div className="mt-6">
        <WorkspaceTabs active={activeTab} onChange={setActiveTab} />
      </div>

      <div className="mt-4 bg-[#0f0f0f] p-4 rounded">
        {activeTab === "overview" && <Overview caseData={caseData} refreshCase={loadCase} />}
        {activeTab === "documents" && <Documents caseId={caseId} />}
        {activeTab === "notes" && <Notes caseId={caseId} />}
        {activeTab === "aitools" && <AITools caseId={caseId} />}
        {activeTab === "timeline" && <Timeline caseId={caseId} />}
        {activeTab === "billing" && <Billing caseId={caseId} />}
      </div>
    </div>
  );
}
