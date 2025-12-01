import React from "react";
import AIWorkspace from "../AIWorkspace";

export default function CaseAIWorkspace({ caseId }) {
  return (
    <div className="min-h-[500px]">
      <AIWorkspace caseId={caseId} />
    </div>
  );
}
