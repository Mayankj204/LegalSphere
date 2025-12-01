// client/src/pages/AIChatNew.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import aiChatService from "../services/aiChatService";
import ChatBubble from "../components/ChatBubble";
import TypingDots from "../components/TypingDots";
import ChatSidebar from "../components/ChatSidebar"; // optional component from earlier
import { getDocumentById } from "../services/documentService";

export default function AIChatNew() {
  const { id: documentId } = useParams();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!documentId) return;
    (async () => {
      try {
        const { sessionId } = await aiChatService.startSession(documentId);
        setSessionId(sessionId);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [documentId]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    const text = input.trim();
    setInput("");
    // optimistic user message
    setMessages(prev => [...prev, { role: "user", text }]);

    // start streaming SSE
    setStreaming(true);
    let assistantText = "";
    streamRef.current = aiChatService.streamMessage(sessionId, text, (data) => {
      if (data.done) {
        setStreaming(false);
        setMessages(prev => [...prev, { role: "assistant", text: assistantText }]);
      } else {
        assistantText += data.text;
        // update messages with a temporary assistant message
        setMessages(prev => {
          // remove previous streaming assistant placeholder if any
          const withoutPlaceholder = prev.filter(m => !(m.role==="assistant" && m.temp));
          return [...withoutPlaceholder, { role: "assistant", text: assistantText, temp: true }];
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4">
      <div className="max-w-6xl mx-auto flex gap-6">
        <div className="w-72">
          <ChatSidebar onSelect={(doc)=> window.location.href=`/ai-chat/${doc._id}`} />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">AI Chat (Document)</h2>

          <div className="bg-[#0f0f0f] p-4 rounded h-[60vh] overflow-y-auto" id="chat-window">
            {messages.map((m, i) => <ChatBubble key={i} role={m.role} text={m.text} />)}
            {streaming && <div className="mt-2"><TypingDots /></div>}
          </div>

          <div className="mt-4 flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-3 rounded bg-[#111] border border-red-600/30"
              placeholder="Ask about this document or Indian law..."
            />
            <button onClick={sendMessage} className="px-4 py-3 bg-red-600 rounded">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
