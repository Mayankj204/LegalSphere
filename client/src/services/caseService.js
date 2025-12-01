// client/src/services/caseService.js
import api from "./api";

/**
 * caseService - wrapper for case-related API calls
 * Endpoints used:
 * GET  /api/cases            -> returns cases for logged-in lawyer (or all)
 * POST /api/cases            -> create case
 * PATCH /api/cases/:id       -> update case
 * DELETE /api/cases/:id      -> delete case (and optionally cascade documents)
 */

export const getLawyerCases = async () => {
  const res = await api.get("/cases");
  return res.data.cases || [];
};

export const createCase = async (payload) => {
  const res = await api.post("/cases", payload);
  return res.data.case;
};

export const updateCase = async (caseId, payload) => {
  const res = await api.patch(`/cases/${caseId}`, payload);
  return res.data.case;
};

export const deleteCase = async (caseId) => {
  const res = await api.delete(`/cases/${caseId}`);
  return res.data;
};

export default {
  getLawyerCases,
  createCase,
  updateCase,
  deleteCase,
};
