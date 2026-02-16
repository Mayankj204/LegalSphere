// client/src/services/caseService.js
import api from "./api";

/**
 * caseService - wrapper for case-related API calls
 * * Note: Based on your backend logic, getCases() typically returns 
 * data filtered by the logged-in user's role (Client or Lawyer).
 */

/* ================= GET ALL CASES ================= */
// General fetch for the logged-in user
export const getCases = async () => {
  const res = await api.get("/cases");
  return res.data; // return full object now
};


/* ================= GET LAWYER SPECIFIC CASES ================= */
/**
 * Fixes the "does not provide an export named 'getLawyerCases'" error.
 * If your backend uses the same route for both, we alias it here.
 */
export const getLawyerCases = async () => {
  const res = await api.get("/cases");
  return res.data?.cases || [];
};

/* ================= GET SINGLE CASE ================= */
export const getCaseById = async (caseId) => {
  const res = await api.get(`/cases/${caseId}`);
  return res.data?.case;
};


/* ================= CREATE CASE ================= */
export const createCase = async (payload) => {
  const res = await api.post("/cases", payload);
  return res.data?.case;
};

/* ================= UPDATE CASE ================= */
export const updateCase = async (caseId, payload) => {
  const res = await api.patch(`/cases/${caseId}`, payload);
  return res.data?.case;
};

/* ================= DELETE CASE ================= */
export const deleteCase = async (caseId) => {
  const res = await api.delete(`/cases/${caseId}`);
  return res.data;
};

// Exporting both individual named exports and a default object
const caseService = {
  getCases,
  getLawyerCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
};

export default caseService;