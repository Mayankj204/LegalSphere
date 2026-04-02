// client/src/pages/workspace/CaseAIWorkspace.jsx
import React, { useState, useRef, useEffect } from "react";
import workspaceService from "../../services/workspaceService";

export default function CaseAIWorkspace({ caseId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  /* -------------------------------------------------- */
  /* SAFE TEXT FORMATTER (🔥 FIX) */
  /* -------------------------------------------------- */
  const formatText = (text) => {
    if (!text) return "";

    if (typeof text === "string") return text;

    if (typeof text === "object") {
      // Try meaningful fields first
      return text.name || text.email || JSON.stringify(text);
    }

    return String(text);
  };

  /* -------------------------------------------------- */
  /* LOAD CHAT HISTORY */
  /* -------------------------------------------------- */
  useEffect(() => {
    const loadChat = async () => {
      try {
        const history = await workspaceService.getCaseChat(caseId);

        if (history && history.length > 0) {
          const safeHistory = history.map((m) => ({
            ...m,
            text: formatText(m.text),
          }));
          setMessages(safeHistory);
        } else {
          setMessages([
            {
              role: "assistant",
              text:
                "I’ve indexed the case documents. Ask me anything related to this case.",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    };

    if (caseId) loadChat();
  }, [caseId]);

  /* -------------------------------------------------- */
  /* AUTO SCROLL */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  /* -------------------------------------------------- */
  /* SEND MESSAGE */
  /* -------------------------------------------------- */
  const send = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;

    const query = input.trim();

    const userMessage = {
      role: "user",
      text: query || "Uploaded a file",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await workspaceService.caseChat(
        caseId,
        query,
        selectedFile
      );

      setSelectedFile(null);

      const answerText = formatText(res?.answer);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: answerText || "No response received.",
          sources: res?.sources || [],
          createdAt: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------- */
  /* FORMAT TIME */
  /* -------------------------------------------------- */
  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* -------------------------------------------------- */
  /* UI */
  /* -------------------------------------------------- */
  return (
    <div className="flex flex-col h-[75vh] text-slate-200">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Case Assistant</h2>
        <p className="text-sm text-gray-400">
          Ask questions or upload documents for AI analysis
        </p>
      </div>

      {/* Chat Area */}
      <div
        ref={chatRef}
        className="flex-1 bg-[#111] border border-gray-800 rounded-xl p-6 overflow-y-auto space-y-5"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-lg text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1c1c1c] text-gray-300 border border-gray-700"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs opacity-60">
                  {m.role === "user" ? "You" : "Assistant"}
                </span>
                <span className="text-xs opacity-40">
                  {formatTime(m.createdAt)}
                </span>
              </div>

              {/* 🔥 FIXED RENDER */}
              {formatText(m.text)}

              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {m.sources.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-700 px-2 py-1 rounded"
                      >
                        {s.filename || "Document"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-400">Thinking...</div>
        )}
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="mt-3 text-sm bg-[#1c1c1c] border border-gray-700 rounded-lg px-4 py-2 flex justify-between items-center">
          <span>{selectedFile.name}</span>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-red-400 text-xs"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="mt-4 flex gap-3 items-center">
        {/* File Upload */}
        <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-sm">
          📎
          <input
            type="file"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </label>

        {/* Input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask something about this case..."
          className="flex-1 px-4 py-3 bg-[#111] border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />

        {/* Send */}
        <button
          onClick={send}
          disabled={loading || (!input.trim() && !selectedFile)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}