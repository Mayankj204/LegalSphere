// client/src/pages/AIWorkspace.jsx
import React, { useState, useEffect, useRef } from "react";
import aiChatService from "../services/aiChatService";
import { uploadDocument, getAllDocuments } from "../services/documentService";
import ChatBubble from "../components/ChatBubble";
import TypingDots from "../components/TypingDots";
import PageTransition from "../components/PageTransition";

export default function AIWorkspace() {
  const [documents, setDocuments] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => { loadDocs(); }, []);

  const loadDocs = async () => {
    try {
      const docs = await getAllDocuments();
      setDocuments(docs || []);
    } catch (err) { console.error("Source Retrieval Error:", err); }
  };

  const startChatForDocument = async (doc) => {
    setCurrentDoc(doc);
    setSessionId(null);
    setMessages([{ role: "assistant", text: `NODE_ESTABLISHED: Document "${doc.filename}" is now the primary context.` }]);

    const session = await aiChatService.startSession(doc._id);
    if (!session?.sessionId) {
      setMessages(prev => [...prev, { role: "assistant", text: "⚠️ System Interrupt: Failed to initialize AI context." }]);
      return;
    }
    setSessionId(session.sessionId);

    setMessages(prev => [
      ...prev,
      { role: "assistant", text: `◈ SUMMARY BRIEFING:\n${doc.summary || "Pending analysis..."}` },
      { role: "assistant", text: `◈ KEY LEGAL NODES:\n${doc.keypoints?.join("\n• ") || "None extracted."}` }
    ]);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessages(prev => [...prev, { role: "assistant", text: "⚡ SECURE_UPLOAD: Transmitting data to encrypted node..." }]);

    try {
      const doc = await uploadDocument(file);
      await loadDocs();
      setMessages(prev => [...prev, { role: "assistant", text: `TRANSFERRED: ${doc.filename} successfully added to vault.` }]);
      startChatForDocument(doc);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: `❌ UPLOAD_ERROR: ${err.message}` }]);
    }
  };

  const sendMessage = () => {
    if (!sessionId || !input.trim() || streaming) return;
    const userText = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setStreaming(true);
    let assistantText = "";

    aiChatService.streamMessage(sessionId, userText, (data) => {
      if (data.error) {
        setStreaming(false);
        setMessages(prev => [...prev, { role: "assistant", text: `⚠️ ERROR: ${data.error}` }]);
        return;
      }
      if (data.done) {
        setStreaming(false);
        setMessages(prev => [...prev.filter(m => !m.temp), { role: "assistant", text: assistantText }]);
        return;
      }
      if (data.text) {
        assistantText += data.text;
        setMessages(prev => [...prev.filter(m => !m.temp), { role: "assistant", text: assistantText, temp: true }]);
      }
    });
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, streaming]);

  return (
    <PageTransition>
      <div className="h-screen bg-[#050505] text-slate-200 flex overflow-hidden pt-20">
        
        {/* SOURCE DISCOVERY SIDEBAR */}
        <div className="w-80 bg-[#0A0A0A] border-r border-white/5 p-6 flex flex-col shadow-2xl z-20 transition-all duration-500">
          <div className="mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              Source Discovery
            </h2>
            <p className="text-[9px] text-gray-600 font-mono mt-1 uppercase tracking-tighter">Vault Capacity: 256-bit AES</p>
          </div>

          <label className="group relative mb-8 cursor-pointer overflow-hidden rounded-2xl border border-red-600/30 bg-red-600/5 p-5 text-center transition-all hover:bg-red-600/10 active:scale-95 shadow-lg shadow-red-600/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Add Evidence Node</span>
            <input type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileUpload} />
          </label>

          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
            {documents.length === 0 ? (
              <p className="text-[9px] text-gray-700 uppercase tracking-widest text-center py-10 italic">No Evidence Detected</p>
            ) : (
              documents.map(doc => {
                const isActive = currentDoc?._id === doc._id;
                return (
                  <div
                    key={doc._id}
                    onClick={() => startChatForDocument(doc)}
                    className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                      isActive ? "bg-red-600/10 border-red-600/40 shadow-[0_0_20px_rgba(220,38,38,0.1)]" : "bg-transparent border-white/5 hover:border-white/10"
                    }`}
                  >
                    <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-gray-500 group-hover:text-slate-300"}`}>{doc.filename}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[8px] text-gray-600 font-mono uppercase tracking-tighter">{new Date(doc.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                      {isActive && <div className="w-1 h-1 bg-red-600 rounded-full animate-ping" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* INTELLIGENCE FEED */}
        <div className="flex-1 flex flex-col relative bg-[#050505]">
          {/* Ambient radial background glow */}
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-red-600/[0.01] blur-[120px] rounded-full pointer-events-none" />
          
          <header className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md sticky top-0 z-10">
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-[0.3em]">Legal Intelligence <span className="text-red-600">Terminal</span></h1>
              <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest mt-1">Grounding: {currentDoc ? "ACTIVE_NODE" : "WAITING_FOR_CONTEXT"}</p>
            </div>
            
            <div className="flex gap-4 items-center">
              {currentDoc && (
                 <div className="flex items-center gap-3 px-4 py-1.5 bg-red-600/5 rounded-full border border-red-600/20 shadow-lg shadow-red-600/5">
                    <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Focus: {currentDoc.filename.substring(0, 20)}...</span>
                 </div>
              )}
            </div>
          </header>

          {/* CHAT AREA */}
          

[Image of Retrieval-Augmented Generation process diagram]

          
          <div ref={chatRef} className="flex-1 p-10 overflow-y-auto space-y-8 custom-scrollbar relative">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                 <div className="w-24 h-24 border-2 border-dashed border-white rounded-full flex items-center justify-center text-5xl mb-8 animate-spin-slow">◈</div>
                 <p className="text-[10px] uppercase font-black tracking-[0.6em]">Initialize Source Analysis</p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-8 pb-10">
                {messages.map((m, i) => (
                  <div key={i} className="animate-fade-in">
                    <ChatBubble role={m.role} text={m.text} />
                  </div>
                ))}
                {streaming && <div className="pl-4"><TypingDots /></div>}
              </div>
            )}
          </div>

          {/* COMMAND INPUT UNIT */}
          <div className="p-10 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent">
            <div className="max-w-4xl mx-auto flex gap-4 items-center relative group">
              <label className="cursor-pointer bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 hover:border-red-600/50 transition-all text-gray-600 hover:text-red-500 shadow-2xl active:scale-90">
                <span className="text-xl">⊕</span>
                <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleFileUpload} />
              </label>

              <div className="relative flex-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="w-full pl-6 pr-20 py-4 rounded-[1.5rem] bg-[#0A0A0A] border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-red-600/40 transition-all shadow-2xl placeholder:text-gray-800 font-sans"
                  placeholder="Ask about document facts or legal implications..."
                />
                <div className="absolute right-4 top-4 hidden md:flex gap-1 items-center opacity-40">
                   <kbd className="h-5 px-1.5 border border-white/20 bg-white/5 text-gray-500 rounded text-[9px] font-mono">ENTER</kbd>
                </div>
              </div>

              <button
                onClick={sendMessage}
                disabled={!input.trim() || streaming || !sessionId}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all shadow-xl shadow-red-600/10 active:scale-95 disabled:opacity-30 disabled:grayscale"
              >
                {streaming ? "Synthesizing..." : "Execute"}
              </button>
            </div>
            <p className="mt-5 text-center text-[9px] text-gray-800 font-mono uppercase tracking-[0.5em]">
              Verified Grounded Node // V.4.2 // Encrypted Session
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}