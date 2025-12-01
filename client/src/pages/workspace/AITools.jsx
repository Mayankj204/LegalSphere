// client/src/pages/workspace/AITools.jsx
import React, { useState, useEffect, useRef } from "react";
import aiService from "../../services/aiService";

export default function AITools({ caseId }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "I analyze only documents & notes related to this case." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

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
        { role: "assistant", text: res.answer || "No response available." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Could not process request." },
      ]);
    }

    setLoading(false);
  };

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
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Failed to generate summary." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">Case AI Assistant</h2>

      {/* Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={summarize}
          className="px-4 py-2 bg-red-700 rounded hover:bg-red-800 text-sm"
        >
          📄 Summarize Case
        </button>
      </div>

      {/* Chat */}
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

        {loading && <div className="text-gray-400 text-sm italic">AI is thinking...</div>}
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask something related to this case..."
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
