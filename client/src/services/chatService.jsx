// client/src/services/chatService.js
import API from "./api";

const BASE = "/chat";

export default {
  createSession: async (documentId) => {
    const res = await API.post(`${BASE}/session`, { documentId });
    return res.data;
  },

  sendMessage: async (sessionId, message) => {
    const res = await API.post(`${BASE}/message`, {
      sessionId,
      message,
    });
    return res.data;
  },

  getMessages: async (sessionId) => {
    const res = await API.get(`${BASE}/session/${sessionId}/messages`);
    return res.data;
  },
};
