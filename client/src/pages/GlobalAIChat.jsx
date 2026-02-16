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
        "Hello 👋 I’m your Legal Assistant.\n\n" +
        "You can ask me about Indian laws, legal terms, or document drafting guidance.\n\nHow can I assist you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const chatRef = useRef(null);

  /* Auto scroll */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;

    const userText = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
    ]);

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
          {
            role: "assistant",
            text:
              "⚠️ I’m having trouble responding right now. Please try again.",
          },
        ]);
      }
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col items-center pt-24 pb-10 px-6">

        {/* HEADER */}
        <div className="w-full max-w-4xl mb-6 flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Legal Assistant
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Instant guidance for your legal questions
            </p>
          </div>

          <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-semibold uppercase rounded-full border border-green-500/20">
            Online
          </span>
        </div>

        {/* CHAT CONTAINER */}
        <div
          ref={chatRef}
          className="w-full max-w-4xl flex-1 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 overflow-y-auto shadow-xl mb-6"
        >
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <ChatBubble
                key={index}
                role={msg.role}
                text={msg.text}
              />
            ))}

            {streaming && (
              <div className="flex justify-start">
                <TypingDots />
              </div>
            )}
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="w-full max-w-4xl">
          <div className="flex items-center gap-3">
            <input
              className="flex-1 px-5 py-4 bg-[#0A0A0A] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-600"
              placeholder="Ask a legal question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
              className="px-6 py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-600 text-white text-xs font-semibold uppercase rounded-xl transition-all active:scale-95"
            >
              {streaming ? "Thinking..." : "Send"}
            </button>
          </div>

          <p className="mt-3 text-center text-[10px] text-gray-600">
            This AI provides general legal information only.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
