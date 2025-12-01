import React, { useState, useEffect, useRef } from "react";
import aiChatService from "../services/aiChatService";
import ChatBubble from "../components/ChatBubble";

export default function GlobalAIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "👋 Hello! I am your *Global Legal AI Assistant*.\n\n" +
        "You can ask anything about Indian law, drafting, IPC/CrPC, contracts, legal procedures, rights, notices, or general advice.",
    },
  ]);

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const chatRef = useRef(null);

  /* 🔽 Auto-scroll on new messages */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  /* ---------------------------------------------------------
     🚀 SEND MESSAGE + STREAM GLOBAL AI RESPONSE
  --------------------------------------------------------- */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    let aiBuffer = "";
    setStreaming(true);

    // Start SSE streaming (GET request)
    aiChatService.streamGeneral(userText, (chunk) => {
      if (chunk.done) {
        setStreaming(false);

        // Add final message
        setMessages((prev) => [
          ...prev.filter((m) => !m.temp),
          { role: "assistant", text: aiBuffer },
        ]);
      } else if (chunk.text) {
        aiBuffer += chunk.text;

        // Update temporary bubble
        setMessages((prev) => [
          ...prev.filter((m) => !m.temp),
          { role: "assistant", text: aiBuffer, temp: true },
        ]);
      } else if (chunk.error) {
        setStreaming(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: `❌ Error: ${chunk.error}` },
        ]);
      }
    });
  };

  /* ---------------------------------------------------------
     UI RENDER
  --------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">

      <h1 className="text-3xl font-bold mb-4 text-red-500">
        Global Legal AI Assistant
      </h1>

      <p className="text-gray-400 mb-4">
        Ask general legal questions — IPC, CrPC, drafting, notices, contracts, rights, etc.
      </p>

      {/* CHAT WINDOW */}
      <div
        ref={chatRef}
        className="h-[70vh] bg-[#0f0f0f] border border-red-600/30 rounded-lg p-4 overflow-y-auto"
      >
        {messages.map((msg, index) => (
          <ChatBubble key={index} role={msg.role} text={msg.text} />
        ))}

        {streaming && (
          <div className="text-gray-500 text-sm italic mt-1">AI is typing…</div>
        )}
      </div>

      {/* INPUT BOX */}
      <div className="mt-4 flex gap-3">
        <input
          className="flex-1 px-4 py-3 bg-[#111] border border-red-600/30 rounded"
          placeholder="Ask anything — drafting, IPC/CrPC, rights, legal advice..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-red-600 rounded hover:bg-red-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
