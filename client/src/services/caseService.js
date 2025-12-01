// src/services/caseService.js
import API from "./api";

export const getCaseById = async (id) => {
  const res = await API.get(`/cases/${id}`);
  return res.data;
};

export const getUserCases = async () => {
  const res = await API.get("/cases/mycases");
  return res.data;
};

export const uploadDocument = async (caseId, formData) => {
  const res = await API.post(`/cases/${caseId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
