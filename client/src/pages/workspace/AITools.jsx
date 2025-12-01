// client/src/pages/workspace/AITools.jsx
import React, { useState, useEffect, useRef } from "react";
import aiService from "../../services/aiService";

export default function AITools({ caseId }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Ask me anything about this case." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  /* -------------------- SEND MESSAGE -------------------- */
  const send = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await aiService.queryCase(caseId, q);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.answer || "No response." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Failed to fetch AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ SUMMARIZE CASE ------------------ */
  const summarize = async () => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: "📄 Generating case summary..." },
    ]);
    try {
      const res = await aiService.summarizeCase(caseId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.summary || "No summary available." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Failed to summarize case." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ RENDER ------------------ */

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">AI Legal Assistant</h2>

      {/* Tools Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={summarize}
          className="px-4 py-2 bg-red-700 rounded hover:bg-red-800 text-sm"
        >
          📄 Summarize Case
        </button>

        <button
          onClick={() => send()}
          className="px-4 py-2 bg-[#333] rounded border border-red-600/40 text-sm hover:bg-[#444]"
          disabled={!input.trim()}
        >
          ➤ Ask
        </button>
      </div>

      {/* Chat Area */}
      <div
        ref={chatRef}
        className="flex-1 bg-[#0f0f0f] border border-red-600/20 rounded p-4 overflow-y-auto"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 p-3 rounded max-w-[80%] ${
              m.role === "user"
                ? "ml-auto bg-red-700 text-white"
                : "mr-auto bg-[#111] border border-red-600/20"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm italic">AI is typing...</div>
        )}
      </div>

      {/* Input Box */}
      <div className="mt-3 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything related to this case..."
          className="flex-1 px-4 py-2 bg-[#111] border border-red-600/30 rounded"
        />

        <button
          onClick={send}
          disabled={!input.trim()}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
