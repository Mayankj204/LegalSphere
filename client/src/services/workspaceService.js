// client/src/services/workspaceService.js
import api from "./api";

/* ==========================================================
   REAL API SERVICE (connected to your actual backend)
   ========================================================== */

const realService = {
  /* --------------------- CASE --------------------- */

  getCaseById: async (caseId) => {
    const res = await api.get(`/cases/${caseId}`);
    return res.data.case;
  },

  /* ------------------- DOCUMENTS ------------------- */

  getCaseDocuments: async (caseId) => {
    const res = await api.get(`/cases/${caseId}/documents`);
    return res.data.documents || [];
  },

  uploadCaseDocument: async (caseId, file) => {
    const form = new FormData();
    form.append("file", file);

    const res = await api.post(`/cases/${caseId}/documents`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.document;
  },

  updateCaseDocument: async (caseId, docId, payload) => {
    const res = await api.patch(`/cases/${caseId}/documents/${docId}`, payload);
    return res.data.updated;
  },

  deleteCaseDocument: async (caseId, docId) => {
    const res = await api.delete(`/cases/${caseId}/documents/${docId}`);
    return res.data;
  },

  /* --------------------- NOTES --------------------- */

  getCaseNotes: async (caseId) => {
    const res = await api.get(`/cases/${caseId}/notes`);
    return res.data.notes || [];
  },

  addNote: async (caseId, payload) => {
    const res = await api.post(`/cases/${caseId}/notes`, payload);
    return res.data.note;
  },

  /* ------------------- TIMELINE -------------------- */

  getTimeline: async (caseId) => {
    const res = await api.get(`/cases/${caseId}/timeline`);
    return res.data.timeline || [];
  },

  addTimelineEvent: async (caseId, payload) => {
    const res = await api.post(`/cases/${caseId}/timeline`, payload);
    return res.data.event;
  },

  /* -------------------- BILLING -------------------- */

  getBilling: async (caseId) => {
    const res = await api.get(`/cases/${caseId}/billing`);
    return res.data.billing || [];
  },

  addBillingEntry: async (caseId, payload) => {
    const res = await api.post(`/cases/${caseId}/billing`, payload);
    return res.data.entry;
  },

  /* -------------------- HEARINGS -------------------- */

  getHearings: async () => {
    const res = await api.get(`/hearings/all`);
    return res.data.hearings || [];
  },

  addHearing: async (caseId, payload) => {
    const res = await api.post(`/cases/${caseId}/hearings`, payload);
    return res.data.hearing;
  },

  /* --------------------- TASKS ---------------------- */

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
  }
};

/* ==========================================================
   MOCK SERVICE (used until backend is ready)
   ========================================================== */

const mockService = {
  /* --------------------- CASE --------------------- */
  getCaseById: async (caseId) => ({
    _id: caseId,
    title: "State vs Rahul Kumar – FIR 28/2024",
    clientName: "Rahul Kumar",
    court: "Patiala House Court, Delhi",
    status: "In Progress",
    confidential: true,
    collaborators: ["juniorLawyer01"],
    deadlines: [
      { label: "Next Hearing", date: "2025-01-15" },
      { label: "File Reply", date: "2024-12-20" }
    ],
    quickNotes: "Client denies charges. Next hearing important."
  }),

  /* ------------------- DOCUMENTS ------------------- */
  getCaseDocuments: async () => [
    {
      _id: "doc1",
      filename: "FIR_Copy.pdf",
      uploadedAt: "2024-12-10",
      summary: "This FIR contains allegations related to an altercation...",
      storageUrl: "https://example.com/FIR.pdf",
      tag: "FIR"
    }
  ],

  uploadCaseDocument: async () => ({ message: "Uploaded (mock)" }),
  updateCaseDocument: async () => ({ message: "Updated (mock)" }),
  deleteCaseDocument: async () => ({ message: "Deleted (mock)" }),

  /* --------------------- NOTES --------------------- */
  getCaseNotes: async () => [
    { _id: "1", text: "Meeting with client today.", createdAt: "2024-12-11" }
  ],

  addNote: async () => ({ message: "Added (mock)" }),

  /* ------------------- TIMELINE -------------------- */
  getTimeline: async () => [
    { _id: "t1", title: "FIR Uploaded", details: "Document added", timestamp: "2024-12-11" }
  ],

  addTimelineEvent: async () => ({ message: "Event added (mock)" }),

  /* -------------------- BILLING -------------------- */
  getBilling: async () => [
    { _id: "b1", title: "Consultation", amount: 1500, description: "Client meeting" }
  ],

  addBillingEntry: async () => ({ message: "Billing added (mock)" }),

  /* -------------------- HEARINGS -------------------- */
  getHearings: async () => [
    { _id: "h1", date: "2025-01-15", court: "District Court", purpose: "Initial hearing" }
  ],

  addHearing: async () => ({ message: "Hearing added (mock)" }),

  /* --------------------- TASKS ---------------------- */
  getTasks: async () => [
    { _id: "task1", title: "Prepare petition", completed: false, dueDate: "2024-12-20" }
  ],
    // Case chat (case-specific)
  caseChat: async (caseId, message) => {
    const res = await api.post(`/ai/case-chat/${caseId}`, { message });
    return res.data;
  },


  addTask: async () => ({ message: "Task added (mock)" }),
  toggleTask: async () => ({ message: "Task toggled (mock)" })
};

/* ==========================================================
   SWITCH HERE BETWEEN MOCK & REAL
   ========================================================== */

const USE_MOCK = false;  // ⬅ SET THIS TO FALSE WHEN BACKEND IS READY

export default USE_MOCK ? mockService : realService;
