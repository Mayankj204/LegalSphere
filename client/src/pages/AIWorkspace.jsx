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

  // -----------------------------------------------------
  // Load all documents
  // -----------------------------------------------------
  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const docs = await getAllDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error("Failed loading documents", err);
    }
  };

  // -----------------------------------------------------
  // Start chat for selected document
  // -----------------------------------------------------
  const startChatForDocument = async (doc) => {
    setCurrentDoc(doc);
    setSessionId(null); // reset session

    // Reset messages
    setMessages([
      { role: "assistant", text: `📄 Loaded document: ${doc.filename}` }
    ]);

    // Create backend chat session
    const session = await aiChatService.startSession(doc._id);

    if (!session || !session.sessionId) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "❌ Could not start AI session." }
      ]);
      return;
    }

    setSessionId(session.sessionId);

    // Display summary + key points
    setMessages(prev => [
      ...prev,
      { role: "assistant", text: `📝 Summary:\n${doc.summary || "(No summary)"}` },
      {
        role: "assistant",
        text: `📌 Key Points:\n${JSON.stringify(doc.keypoints || [], null, 2)}`
      }
    ]);
  };

  // -----------------------------------------------------
  // Upload New Document
  // -----------------------------------------------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages(prev => [
      ...prev,
      { role: "system", text: "📄 Uploading document..." }
    ]);

    try {
      const doc = await uploadDocument(file);
      await loadDocs();

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: `Document uploaded: ${doc.filename}` }
      ]);

      startChatForDocument(doc);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: `❌ Upload failed: ${err.message}` }
      ]);
    }
  };

  // -----------------------------------------------------
  // Send a message to the document AI
  // -----------------------------------------------------
  const sendMessage = () => {
    if (!sessionId) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "❌ No active session. Select a document." }
      ]);
      return;
    }

    if (!input.trim()) return;

    const userText = input;
    setInput("");

    // add user message
    setMessages(prev => [...prev, { role: "user", text: userText }]);

    setStreaming(true);
    let assistantText = "";

    aiChatService.streamMessage(sessionId, userText, (data) => {
      if (data.error) {
        setStreaming(false);
        setMessages(prev => [...prev, { role: "assistant", text: `❌ ${data.error}` }]);
        return;
      }

      // STREAM DONE
      if (data.done) {
        setStreaming(false);

        setMessages(prev => [
          ...prev.filter(m => !m.temp),
          { role: "assistant", text: assistantText }
        ]);

        return;
      }

      // STREAMING TEXT EVENTS
      if (data.text) {
        assistantText += data.text;

        setMessages(prev => {
          const clean = prev.filter(m => !m.temp);
          return [
            ...clean,
            { role: "assistant", text: assistantText, temp: true }
          ];
        });
      }
    });
  };

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* ------------------------------------ */}
      {/* LEFT SIDEBAR - DOCUMENT LIST        */}
      {/* ------------------------------------ */}
      <div className="w-72 border-r border-red-600/30 p-4">
        <h2 className="text-xl font-bold mb-4">Documents</h2>

        <label className="block mb-4 cursor-pointer bg-red-700 text-center py-2 rounded">
          Upload Document
          <input
            type="file"
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
          />
        </label>

        <div className="space-y-2">
          {documents.map(doc => (
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

      {/* ------------------------------------ */}
      {/* CHAT AREA                            */}
      {/* ------------------------------------ */}
      <div className="flex-1 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Legal AI Workspace</h1>

        <div
          ref={chatRef}
          className="flex-1 bg-[#0f0f0f] p-4 rounded overflow-y-auto"
        >
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} />
          ))}

          {streaming && <TypingDots />}
        </div>

        {/* Input Area */}
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

          <button
            onClick={sendMessage}
            className="px-4 py-3 bg-red-600 rounded hover:bg-red-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
