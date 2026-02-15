// client/src/pages/AIChatNew.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import aiChatService from "../services/aiChatService";
import ChatBubble from "../components/ChatBubble";
import TypingDots from "../components/TypingDots";
import ChatSidebar from "../components/ChatSidebar";
import PageTransition from "../components/PageTransition";

export default function AIChatNew() {
  const { id: documentId } = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const chatWindowRef = useRef(null);

  // Initialize Session
  useEffect(() => {
    if (!documentId) return;
    (async () => {
      try {
        setMessages([{ role: "assistant", text: "Establishing secure neural link to document... Node ready." }]);
        const { sessionId } = await aiChatService.startSession(documentId);
        setSessionId(sessionId);
      } catch (err) {
        console.error("Session initialization failed:", err);
      }
    })();
  }, [documentId]);

  // Auto-scroll logic
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    const text = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", text }]);
    setStreaming(true);
    
    let assistantText = "";
    aiChatService.streamMessage(sessionId, text, (data) => {
      if (data.done) {
        setStreaming(false);
        // Finalize message by removing temp flag
        setMessages(prev => {
          const filtered = prev.filter(m => !m.temp);
          return [...filtered, { role: "assistant", text: assistantText }];
        });
      } else {
        assistantText += data.text;
        setMessages(prev => {
          const withoutPlaceholder = prev.filter(m => !m.temp);
          return [...withoutPlaceholder, { role: "assistant", text: assistantText, temp: true }];
        });
      }
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 pt-24 pb-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-[85vh]">
          
          {/* SOURCE NAVIGATOR (Left) */}
          <div className="lg:w-80 flex flex-col h-full">
            <ChatSidebar 
              selectedDocId={documentId} 
              onSelect={(doc) => navigate(`/ai-chat/${doc._id}`)} 
            />
          </div>

          {/* CHAT INTERFACE (Right) */}
          <div className="flex-1 flex flex-col bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            
            {/* AMBIENT HEADER */}
            <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  Legal Analysis Terminal
                </h2>
                <p className="text-[9px] text-gray-600 font-mono mt-1 uppercase tracking-tighter">
                  Status: Grounded Intelligence Active
                </p>
              </div>
              <div className="text-[9px] font-mono text-gray-700 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                SESSION_REF: {sessionId?.substring(0, 8) || "PENDING"}
              </div>
            </header>

            {/* CHAT FEED */}
            [Image of Retrieval-Augmented Generation process diagram]
            <div 
              ref={chatWindowRef} 
              className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar relative"
            >
              {/* Subtle background grid */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                   style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
              
              <div className="relative z-10">
                {messages.length === 0 && !streaming && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                    <p className="text-xs uppercase font-bold tracking-[0.4em]">Initialize Document Source</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <ChatBubble key={i} role={m.role} text={m.text} />
                ))}
                {streaming && (
                  <div className="flex justify-start my-4 animate-fade-in">
                    <TypingDots />
                  </div>
                )}
              </div>
            </div>

            {/* COMMAND INPUT */}
            <div className="p-8 bg-gradient-to-t from-black to-transparent">
              <div className="max-w-4xl mx-auto relative group">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  className="w-full pl-6 pr-32 py-4 bg-[#050505] border border-white/10 rounded-2xl text-sm text-slate-200 focus:outline-none focus:border-red-600/50 transition-all shadow-2xl placeholder:text-gray-700 font-sans"
                  placeholder="Ask about document facts, legal discrepancies, or relevant laws..."
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!input.trim() || streaming}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-red-600/20"
                >
                  {streaming ? "Interpreting..." : "Send Command"}
                </button>
              </div>
              <p className="mt-4 text-center text-[8px] text-gray-700 font-mono uppercase tracking-[0.3em]">
                Encrypted Discovery Session // LegalSphere Node 4.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}