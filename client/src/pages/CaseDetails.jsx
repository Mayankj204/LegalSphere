// src/pages/CaseDetails.jsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import AIChatModal from "../components/AIChatModal";

export default function CaseDetails() {
  const { id } = useParams();
  const [aiOpen, setAiOpen] = useState(false);

  // Mock data
  const caseInfo = {
    title: "Property Dispute",
    description: "A complex property ownership dispute case.",
    status: "In Progress",
  };

  return (
    <PageTransition>
      <div className="pt-32 px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-ls-offwhite">
          Case Details
        </h1>

        <div className="mt-8 p-6 bg-ls-charcoal/40 backdrop-blur-xl rounded-lg-2 border border-ls-red/10 shadow-card">
          <h2 className="text-xl font-bold text-ls-offwhite">{caseInfo.title}</h2>
          <p className="text-ls-muted mt-2">{caseInfo.description}</p>

          <p className="mt-4">
            <span className="text-ls-muted">Status:</span>{" "}
            <span className="text-ls-red font-semibold">{caseInfo.status}</span>
          </p>

          <button
            onClick={() => setAiOpen(true)}
            className="mt-6 px-5 py-3 bg-ls-red text-white rounded-lg font-semibold shadow-glow hover:opacity-90"
          >
            Open AI Assistant
          </button>
        </div>

        <AIChatModal open={aiOpen} onClose={() => setAiOpen(false)} />
      </div>
    </PageTransition>
  );
}
