import React, { useState, useRef, useEffect } from "react";
import workspaceService from "../../services/workspaceService";

export default function CaseAIWorkspace({ caseId }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "📄 Case AI ready — ask about this case." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await workspaceService.caseChat(caseId, q);
      if (res && res.answer) {
        setMessages((m) => [...m, { role: "assistant", text: res.answer }]);
        // optionally display sources
        if (res.sources && res.sources.length) {
          setMessages((m) => [...m, { role: "system", text: `Sources: ${res.sources.map(s=>s.filename).join(", ")}` }]);
        }
      } else {
        setMessages((m) => [...m, { role: "assistant", text: "No answer." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "assistant", text: "❌ Error answering." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">AI Workspace (Case-specific)</h2>

      <div ref={chatRef} className="flex-1 bg-[#0f0f0f] border border-red-600/20 rounded p-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 p-3 rounded max-w-[80%] ${m.role === 'user' ? 'ml-auto bg-red-700 text-white' : 'mr-auto bg-[#111] border border-red-600/20'}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="text-gray-400">AI is working...</div>}
      </div>

      <div className="mt-3 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about this case..."
          className="flex-1 px-4 py-2 bg-[#111] border border-red-600/30 rounded"
        />
        <button onClick={send} disabled={!input.trim()} className="px-4 py-2 bg-red-600 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
