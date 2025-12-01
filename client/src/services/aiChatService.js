// client/src/services/aiChatService.js
import API from "./api";

const BASE = "/ai/chat"; 
// API baseURL = http://localhost:5000/api

export default {
  startSession: async (documentId) => {
    const res = await API.post(`${BASE}/start`, { documentId });
    return res.data;
  },

  postMessage: async (sessionId, message) => {
    const res = await API.post(`${BASE}/message`, { sessionId, message });
    return res.data;
  },

  // SSE streaming (Gemini)
  streamMessage: (sessionId, q, onData) => {
    // IMPORTANT — Use absolute URL for SSE
    const url = `http://localhost:5000/api/ai/chat/stream?sessionId=${encodeURIComponent(
      sessionId
    )}&q=${encodeURIComponent(q)}`;

    const es = new EventSource(url);

    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        onData(data);

        if (data.done) es.close();
      } catch (e) {
        // ignore parse errors
      }
    };

    es.onerror = () => es.close();

    return es;
  },
};
