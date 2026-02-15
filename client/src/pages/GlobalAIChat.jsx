// src/pages/GlobalAIChat.jsx
import React, { useState, useEffect, useRef } from "react";
import aiChatService from "../services/aiChatService";
import ChatBubble from "../components/ChatBubble";
import TypingDots from "../components/TypingDots";
import PageTransition from "../components/PageTransition";

export default function GlobalAIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "👋 Hello! I am your **Legal Support AI**.\n\n" +
        "I can help you understand Indian laws, explain legal terms, or guide you through drafting documents like notices and contracts. What can I help you with today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    let aiBuffer = "";
    setStreaming(true);

    aiChatService.streamGeneral(userText, (chunk) => {
      if (chunk.done) {
        setStreaming(false);
        setMessages((prev) => [
          ...prev.filter((m) => !m.temp),
          { role: "assistant", text: aiBuffer },
        ]);
      } else if (chunk.text) {
        aiBuffer += chunk.text;
        setMessages((prev) => [
          ...prev.filter((m) => !m.temp),
          { role: "assistant", text: aiBuffer, temp: true },
        ]);
      } else if (chunk.error) {
        setStreaming(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: `⚠️ Sorry, I encountered a connection issue. Please try again.` },
        ]);
      }
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 pt-24 pb-12 px-6 flex flex-col items-center">
        
        {/* FRIENDLY HEADER SECTION */}
        <div className="w-full max-w-4xl mb-8 flex flex-col md:flex-row items-center md:items-end justify-between border-b border-white/5 pb-6 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Legal <span className="text-red-600">Helper AI</span>
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Your 24/7 guide for laws, rights, and document help.
            </p>
          </div>
          <div className="flex gap-3">
             <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-full border border-green-500/20 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               AI Online
             </span>
             <span className="px-3 py-1 bg-white/5 text-gray-500 text-[10px] font-bold uppercase rounded-full border border-white/5">
               Private & Secure
             </span>
          </div>
        </div>

        {/* CHAT INTERFACE */}
        

[Image of Retrieval-Augmented Generation process diagram]

        <div 
          ref={chatRef}
          className="w-full max-w-4xl flex-1 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 md:p-10 overflow-y-auto custom-scrollbar relative shadow-2xl mb-6"
        >
          {/* Subtle Background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

          <div className="relative z-10 space-y-4">
            {messages.map((msg, index) => (
              <ChatBubble key={index} role={msg.role} text={msg.text} />
            ))}
            
            {streaming && (
              <div className="flex justify-start pt-2">
                <TypingDots />
              </div>
            )}
          </div>
        </div>

        {/* EASY INPUT BOX */}
        <div className="w-full max-w-4xl">
          <div className="relative flex items-center gap-3">
            <input
              className="flex-1 px-6 py-4 bg-[#0A0A0A] border border-white/10 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-red-600/50 transition-all shadow-xl placeholder:text-gray-700"
              placeholder="Type your question here (e.g., 'What are my tenant rights?')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-600 text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-600/20"
            >
              {streaming ? "Thinking..." : "Ask AI"}
            </button>
          </div>
          <p className="mt-4 text-center text-[10px] text-gray-600 font-medium">
            AI can make mistakes. Please consult a verified lawyer for critical legal decisions.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}