// client/src/pages/AIWorkspace.jsx
import React, { useState, useEffect, useRef } from "react";
import aiChatService from "../services/aiChatService";
import { uploadDocument, getAllDocuments } from "../services/documentService";
import ChatBubble from "../components/ChatBubble";
import TypingDots from "../components/TypingDots";

export default function AIWorkspace() {
  const [documents, setDocuments] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    const docs = await getAllDocuments();
    setDocuments(docs);
  };

  // -------------------------------------------
  // Start Chat Session
  // -------------------------------------------
  const startChatForDocument = async (doc) => {
    setCurrentDoc(doc);

    // start with fresh chat
    setMessages([
      { role: "assistant", text: `📄 Loaded document: ${doc.filename}` },
    ]);

    // create session
    const session = await aiChatService.startSession(doc._id);
    setSessionId(session.sessionId);

    // Add summary
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: `📝 Summary:\n${doc.summary}` },
      {
        role: "assistant",
        text: `📌 Key Points:\n${JSON.stringify(doc.keypoints, null, 2)}`,
      },
    ]);
  };

  // -------------------------------------------
  // Upload Document
  // -------------------------------------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages((prev) => [
      ...prev,
      { role: "system", text: "📄 Uploading document..." },
    ]);

    try {
      const doc = await uploadDocument(file);
      await loadDocs();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Document uploaded: ${doc.filename}` },
      ]);

      startChatForDocument(doc);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `❌ Upload failed: ${err.message}` },
      ]);
    }
  };

  // -------------------------------------------
  // Send User Message
  // -------------------------------------------
  const sendMessage = () => {
    if (!sessionId || !input.trim()) return;

    const userText = input;
    setInput("");

    // user message → chat
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    setStreaming(true);
    let assistantText = "";

    aiChatService.streamMessage(sessionId, userText, (data) => {
      if (data.done) {
        setStreaming(false);

        // final message
        setMessages((prev) => [
          ...prev.filter((m) => !m.temp),
          { role: "assistant", text: assistantText },
        ]);
      } else if (data.text) {
        assistantText += data.text;

        // live updating "typing" temporary message
        setMessages((prev) => {
          const clean = prev.filter((m) => !m.temp);
          return [
            ...clean,
            { role: "assistant", text: assistantText, temp: true },
          ];
        });
      }
    });
  };

  // -------------------------------------------
  // Auto-scroll chat
  // -------------------------------------------
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <div className="w-72 border-r border-red-600/30 p-4">
        <h2 className="text-xl font-bold mb-4">Documents</h2>

        <label className="block mb-4 cursor-pointer bg-red-700 text-center py-2 rounded">
          Upload Document
          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc._id}
              onClick={() => startChatForDocument(doc)}
              className={`p-3 rounded cursor-pointer border ${
                currentDoc?._id === doc._id
                  ? "border-red-500 bg-[#111]"
                  : "border-red-600/30"
              }`}
            >
              <p className="font-semibold text-sm">{doc.filename}</p>
              <p className="text-xs text-gray-400">
                {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- CHAT AREA ---------------- */}
      <div className="flex-1 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Legal AI Workspace</h1>

        <div
          ref={chatRef}
          className="flex-1 bg-[#0f0f0f] p-4 rounded overflow-y-auto"
        >
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} text={msg.text} />
          ))}

          {streaming && <TypingDots />}
        </div>

        {/* -------- INPUT AREA -------- */}
        <div className="mt-4 flex gap-3 items-center">
          <label className="cursor-pointer bg-[#222] px-4 py-3 rounded border border-red-600/40 hover:bg-[#333]">
            📎
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-3 rounded bg-[#111] border border-red-600/30"
            placeholder="Ask anything about this document or Indian law..."
          />

          <button onClick={sendMessage} className="px-4 py-3 bg-red-600 rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
