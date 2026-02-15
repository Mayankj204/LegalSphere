// client/src/components/ChatBubble.jsx
import React from "react";

export default function ChatBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`my-6 flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`relative max-w-[85%] md:max-w-[75%] transition-all duration-300`}>
        
        {/* ROLE INDICATOR */}
        <p className={`text-[8px] uppercase font-black tracking-[0.2em] mb-2 px-1 ${
          isUser ? "text-right text-gray-500" : "text-left text-red-600"
        }`}>
          {isUser ? "Lead Attorney" : "Legal Intelligence Node"}
        </p>

        {/* BUBBLE CONTENT */}
        <div className={`
          p-4 md:p-5 text-sm leading-relaxed shadow-2xl
          ${isUser 
            ? "bg-red-600 text-white rounded-2xl rounded-tr-none shadow-red-600/10" 
            : "bg-[#0A0A0A] text-gray-300 border border-white/5 rounded-2xl rounded-tl-none shadow-black"
          }
        `}>
          {/* Subtle AI Pulse for Assistant Messages */}
          {!isUser && (
            <div className="absolute top-0 left-0 w-full h-full bg-red-600/[0.02] pointer-events-none rounded-2xl rounded-tl-none" />
          )}

          <div className="relative z-10 whitespace-pre-wrap font-sans">
            {text}
          </div>
        </div>

        {/* TIMESTAMP/STATUS (Optional Metadata) */}
        <div className={`mt-2 px-1 flex ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="text-[7px] font-mono text-gray-700 uppercase tracking-widest">
            {isUser ? "Sent // Encrypted" : "Verified Response"}
          </span>
        </div>
      </div>
    </div>
  );
}