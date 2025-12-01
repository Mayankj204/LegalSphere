import API from "./api";

// Existing:
export const generateAISummary = async (text) => {
  const res = await API.post("/ai/summarize", { text });
  return res.data;
};

export const extractKeyPoints = async (text) => {
  const res = await API.post("/ai/keypoints", { text });
  return res.data;
};

export const analyzeCase = async (data) => {
  const res = await API.post("/ai/analyze", data);
  return res.data;
};

// ------------------------------
// ✅ ADD THESE NEW FUNCTIONS
// ------------------------------

export const summarizeCase = async (caseId) => {
  const res = await API.post(`/ai/case/${caseId}/summarize`);
  return res.data;
};

export const queryCase = async (caseId, question) => {
  const res = await API.post(`/ai/case/${caseId}/query`, { question });
  return res.data;
};

// ------------------------------
// Default export (important!)
// ------------------------------
export default {
  generateAISummary,
  extractKeyPoints,
  analyzeCase,
  summarizeCase,
  queryCase,
};
