// client/src/pages/workspace/CaseAIWorkspace.jsx
import React, { useState, useRef, useEffect } from "react";
import workspaceService from "../../services/workspaceService";

export default function CaseAIWorkspace({ caseId }) {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      text: "Research Terminal active. I have indexed all case documents and am ready to provide grounded analysis for Case #" + caseId?.substring(0, 8).toUpperCase() + "." 
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const query = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: query }]);
    setLoading(true);

    try {
      const res = await workspaceService.caseChat(caseId, query);
      if (res && res.answer) {
        setMessages((m) => [...m, { 
          role: "assistant", 
          text: res.answer, 
          sources: res.sources 
        }]);
      } else {
        setMessages((m) => [...m, { 
          role: "assistant", 
          text: "I couldn't find specific details regarding that in the uploaded documents." 
        }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { 
        role: "assistant", 
        text: "Sorry, I had trouble processing that request. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-transparent text-slate-200">
      
      {/* HEADER: STATUS & CONTEXT */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-red-600 rounded-full animate-ping" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white">Document Intelligence</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
           <span className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter">Secure Link: Active</span>
        </div>
      </div>

      {/* CHAT INTERFACE */}
      

[Image of Retrieval-Augmented Generation process diagram]

      <div 
        ref={chatRef} 
        className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6 overflow-y-auto custom-scrollbar relative shadow-2xl"
      >
        <div className="relative z-10 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed transition-all ${
                m.role === 'user' 
                  ? 'bg-red-600 text-white rounded-tr-none shadow-lg shadow-red-600/10' 
                  : 'bg-[#161616] border border-white/5 text-gray-300 rounded-tl-none'
              }`}>
                <p className="text-[8px] uppercase font-black mb-2 tracking-widest opacity-40">
                  {m.role === 'user' ? 'Counsel' : 'Assistant'}
                </p>
                {m.text}

                {/* CITATION SYSTEM */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[9px] font-bold text-gray-500 uppercase mb-2 tracking-tight">Verified from sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {m.sources.map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-red-600/10 text-red-500 border border-red-600/20 px-2 py-0.5 rounded-lg font-medium">
                          {s.filename || "Case_File"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#161616] border border-white/5 px-6 py-4 rounded-2xl rounded-tl-none animate-pulse">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Searching Records...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INPUT COMMAND AREA */}
      <div className="mt-5 flex gap-3">
        <div className="relative flex-1 group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask a question about the case documents..."
            className="w-full px-6 py-4 bg-[#0A0A0A] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-red-600/40 transition-all placeholder:text-gray-700 shadow-2xl"
          />
          <div className="absolute right-4 top-4 hidden md:flex items-center">
             <kbd className="h-6 px-2 border border-white/10 bg-white/5 text-gray-600 rounded text-[10px] font-mono font-bold flex items-center">ENTER</kbd>
          </div>
        </div>

        <button 
          onClick={send} 
          disabled={!input.trim() || loading} 
          className="px-8 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
        >
          {loading ? "..." : "Query"}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">
          End-to-End Encrypted Case Intelligence Node
        </p>
      </div>
    </div>
  );
}