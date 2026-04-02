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
  const cleanId = String(caseId).replace(/"/g, "").trim();

  if (!cleanId) throw new Error("Invalid caseId");

  // 🔥 FORCE OBJECT (NO STRING ALLOWED)
  const safePayload = {
    date: payload.date,
    court: payload.court,
    purpose: payload.purpose,
  };

  console.log("FINAL PAYLOAD:", safePayload); // 🔥 DEBUG

  return await API.post(`/cases/${cleanId}/hearings`, safePayload);
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

  updateNote: async (caseId, noteId, payload) => {
  const res = await api.patch(`/cases/${caseId}/notes/${noteId}`, payload);
  return res.data.note;
},

deleteNote: async (caseId, noteId) => {
  const res = await api.delete(`/cases/${caseId}/notes/${noteId}`);
  return res.data;
},


  toggleTask: async (taskId) => {
    const res = await api.patch(`/tasks/${taskId}/toggle`);
    return res.data.task;
  },

  /* ===================== AI CHAT ===================== */

 getCaseChat: async (caseId) => {
  const res = await api.get(`/ai/case-chat/${caseId}`);
  return res.data.messages;
},
updateUser: async (payload) => {
  const res = await api.patch(`/users/me`, payload);
  return res.data.user;
},
caseChat: async (caseId, message, file) => {
  const formData = new FormData();
  formData.append("message", message);
  if (file) formData.append("file", file);

  const res = await api.post(
    `/ai/case-chat/${caseId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
}
}

export default workspaceService;
