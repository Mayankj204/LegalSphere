// client/src/services/workspaceService.js
import api from "./api";

/* ==========================================================
   WORKSPACE SERVICE (Connected to Backend)
   ========================================================== */

const workspaceService = {

  /* ===================== CASE ===================== */

  getCaseById: async (caseId) => {
    const res = await api.get(`/cases/${caseId}`);
    return res.data.case;
  },

  updateCase: async (caseId, payload) => {
    const res = await api.patch(`/cases/${caseId}`, payload);
    return res.data.case;
  },

  /* ==================== DOCUMENTS ==================== */

  getCaseDocuments: async (caseId) => {
    const res = await api.get(`/cases/${caseId}/documents`);
    return res.data.documents || [];
  },

  uploadCaseDocument: async (caseId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(
      `/cases/${caseId}/documents`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data.document;
  },

  updateCaseDocument: async (caseId, docId, payload) => {
    const res = await api.patch(
      `/cases/${caseId}/documents/${docId}`,
      payload
    );
    return res.data.updated;
  },

  deleteCaseDocument: async (caseId, docId) => {
    const res = await api.delete(
      `/cases/${caseId}/documents/${docId}`
    );
    return res.data;
  },

  /* ===================== NOTES ===================== */

  getCaseNotes: async (caseId) => {
    const res = await api.get(`/cases/${caseId}/notes`);
    return res.data.notes || [];
  },

  addNote: async (caseId, payload) => {
    const res = await api.post(`/cases/${caseId}/notes`, payload);
    return res.data.note;
  },

  /* ==================== TIMELINE ==================== */

  getTimeline: async (caseId) => {
    const res = await api.get(`/cases/${caseId}/timeline`);
    return res.data.timeline || [];
  },

  addTimelineEvent: async (caseId, payload) => {
    const res = await api.post(`/cases/${caseId}/timeline`, payload);
    return res.data.event;
  },

  /* ===================== BILLING ===================== */

  getBilling: async (caseId) => {
    const res = await api.get(`/cases/${caseId}/billing`);
    return res.data.billing || [];
  },

  addBillingEntry: async (caseId, payload) => {
    const res = await api.post(`/cases/${caseId}/billing`, payload);
    return res.data.entry;
  },

  /* ===================== HEARINGS ===================== */

  getHearings: async () => {
    const res = await api.get(`/hearings/all`);
    return res.data.hearings || [];
  },

  addHearing: async (caseId, payload) => {
    const res = await api.post(`/cases/${caseId}/hearings`, payload);
    return res.data.hearing;
  },

  /* ===================== TASKS ===================== */

  getTasks: async () => {
    const res = await api.get(`/tasks/all`);
    return res.data.tasks || [];
  },

  addTask: async (caseId, payload) => {
    const res = await api.post(`/cases/${caseId}/tasks`, payload);
    return res.data.task;
  },

  toggleTask: async (taskId) => {
    const res = await api.patch(`/tasks/${taskId}/toggle`);
    return res.data.task;
  },

  /* ===================== AI CHAT ===================== */

  caseChat: async (caseId, message) => {
    const res = await api.post(`/ai/case-chat/${caseId}`, { message });
    return res.data;
  }

};

export default workspaceService;
