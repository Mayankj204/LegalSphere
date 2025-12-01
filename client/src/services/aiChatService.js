// client/src/services/aiChatService.js
import API from "./api";
import { BACKEND_URL } from "../config";

/* ============================================================
   1️⃣ GLOBAL AI ASSISTANT  (Navbar Chat)
   Route: GET /api/ai/chat/general?q=...
   SSE Streaming
   ============================================================ */
export const streamGeneral = (query, onChunk) => {
  if (!query || !query.trim()) {
    onChunk({ error: "Message is empty." });
    return;
  }

  // Proper SSE GET URL
  const url = `${BACKEND_URL}/api/ai/chat/general?q=${encodeURIComponent(
    query
  )}`;

  let evtSource;
  try {
    evtSource = new EventSource(url);
  } catch (err) {
    console.error("❌ Failed to open SSE stream:", err);
    onChunk({ error: "Cannot connect to AI server." });
    return;
  }

  evtSource.onmessage = (e) => {
    if (!e.data) return;

    let data;
    try {
      data = JSON.parse(e.data);
    } catch {
      console.error("Invalid SSE JSON:", e.data);
      return;
    }

    if (data.error) {
      onChunk({ error: data.error });
      evtSource.close();
      return;
    }

    if (data.done) {
      onChunk({ done: true });
      evtSource.close();
      return;
    }

    if (data.text) {
      onChunk({ text: data.text });
    }
  };

  evtSource.onerror = (err) => {
    console.error("🌐 Global AI SSE disconnected:", err);
    onChunk({ error: "Connection lost." });
    evtSource.close();
  };

  return evtSource;
};


/* ============================================================
   2️⃣ DOCUMENT AI WORKSPACE — START SESSION
   ============================================================ */
export const startSession = async (documentId) => {
  try {
    const res = await API.post("/ai/chat/start", { documentId });

    if (!res.data?.sessionId) {
      console.error("❌ Backend did not return sessionId");
      return { sessionId: null };
    }

    return res.data;
  } catch (err) {
    console.error("startSession error:", err);
    return { sessionId: null };
  }
};


/* ============================================================
   3️⃣ DOCUMENT AI WORKSPACE — STREAM MESSAGE (SSE)
   ============================================================ */
export const streamMessage = (sessionId, q, onChunk) => {
  if (!sessionId) {
    onChunk({ error: "Start a session first." });
    return;
  }

  if (!q || !q.trim()) {
    onChunk({ error: "Message is empty." });
    return;
  }

  const url = `${BACKEND_URL}/api/ai/chat/stream?sessionId=${sessionId}&q=${encodeURIComponent(
    q
  )}`;

  let evtSource;
  try {
    evtSource = new EventSource(url);
  } catch (err) {
    console.error("❌ SSE init error:", err);
    onChunk({ error: "Cannot connect to AI stream." });
    return;
  }

  evtSource.onmessage = (e) => {
    if (!e.data) return;

    let data;
    try {
      data = JSON.parse(e.data);
    } catch {
      console.error("Invalid SSE JSON:", e.data);
      return;
    }

    if (data.error) {
      onChunk({ error: data.error });
      evtSource.close();
      return;
    }

    if (data.done) {
      onChunk({ done: true });
      evtSource.close();
      return;
    }

    if (data.text) {
      onChunk({ text: data.text });
    }
  };

  evtSource.onerror = (err) => {
    console.error("❌ Document AI SSE error:", err);
    onChunk({ error: "Connection lost." });
    evtSource.close();
  };

  return evtSource;
};


/* ============================================================
   4️⃣ DOCUMENT AI — NON-STREAM MESSAGE (fallback)
   ============================================================ */
export const sendMessage = async (sessionId, message) => {
  try {
    const res = await API.post("/ai/chat/message", {
      sessionId,
      message,
    });
    return res.data;
  } catch (err) {
    console.error("sendMessage error:", err);
    return { error: "Failed to send message" };
  }
};


/* ============================================================
   EXPORTS
   ============================================================ */
export default {
  streamGeneral,
  startSession,
  streamMessage,
  sendMessage,
};
