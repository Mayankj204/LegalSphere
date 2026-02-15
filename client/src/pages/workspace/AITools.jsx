// client/src/pages/workspace/AITools.jsx
import React, { useState, useEffect, useRef } from "react";
import aiService from "../../services/aiService";

export default function AITools({ caseId }) {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      text: "Hello. I've analyzed your case files and I am ready to help. You can ask me to find specific facts, summarize long documents, or check legal precedents." 
    },
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
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userQuery }]);
    setLoading(true);

    try {
      const res = await aiService.queryCase(caseId, userQuery);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.answer || "I couldn't find a specific answer for that in the current files." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I had trouble connecting. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const summarize = async () => {
    if (loading) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", text: "Analyzing case files for a summary..." }]);

    try {
      const res = await aiService.summarizeCase(caseId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.summary || "Not enough data to create a summary yet." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Failed to generate summary. Please check if your documents are uploaded correctly." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] bg-transparent text-slate-200">
      
      {/* HEADER: SIMPLE & CLEAN */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-white">Case Intelligence</h2>
        </div>
        
        <button
          onClick={summarize}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-xl text-[10px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-30"
        >
          <span>Summary</span>
        </button>
      </div>

      {/* CHAT FEED */}
      <div
        ref={chatRef}
        className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6 overflow-y-auto custom-scrollbar"
      >
        <div className="space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-red-600 text-white rounded-tr-none shadow-xl shadow-red-600/10"
                    : "bg-[#161616] border border-white/5 text-gray-300 rounded-tl-none"
                }`}
              >
                <span className="block text-[8px] font-black uppercase opacity-40 mb-1 tracking-widest">
                  {m.role === "user" ? "Counsel" : "Assistant"}
                </span>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#161616] border border-white/5 px-6 py-4 rounded-2xl rounded-tl-none animate-pulse">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-red-600 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INPUT BAR */}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about this case..."
          className="flex-1 px-5 py-4 bg-[#0A0A0A] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-red-600/40 transition-all"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="px-6 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-xs uppercase transition-all active:scale-95 disabled:opacity-30"
        >
          Ask
        </button>
      </div>

      <p className="mt-3 text-[9px] text-center text-gray-600 uppercase tracking-widest font-mono">
        AI may produce inaccuracies. Verify critical case facts.
      </p>
    </div>
  );
}