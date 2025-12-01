// src/services/aiService.js
import API from "./api";

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
