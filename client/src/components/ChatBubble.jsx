// client/src/components/ChatBubble.jsx
import React from "react";

export default function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`my-2 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`${isUser ? "bg-red-600 text-white" : "bg-[#111] text-gray-200"} p-3 rounded-lg max-w-[80%] whitespace-pre-wrap`}>
        {text}
      </div>
    </div>
  );
}
