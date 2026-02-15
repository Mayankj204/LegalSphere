// src/components/AIChatModal.jsx
import { useState } from "react";
import AIResultBox from "./AIResultBox";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AIChatModal({ open, onClose, initialContext = "" }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);

  if (!open) return null;

  const handleSend = async () => {
    if (!input.trim()) {
      toast.error("Query parameter required.");
      return;
    }
    setLoading(true);
    
    // Mocking the AI Synthesis delay
    setTimeout(() => {
      const mock = `ANALYSIS COMPLETE: Regarding "${input}" — 
      1. Legal Precedent: Matches standard procedural protocols.
      2. Risk Assessment: Low-to-moderate variance detected in documentation.
      3. Recommendation: Proceed with verification of Exhibit B.`;
      
      setResponses((r) => [mock, ...r]);
      setInput("");
      setLoading(false);
      toast.success("Intelligence Synchronized");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 overflow-hidden">
      {/* Backdrop with intense blur */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose} 
      />

      <motion.div 
        initial={{ y: 100, opacity: 0, scale: 0.95 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        className="relative z-10 w-full max-w-3xl h-[80vh] flex flex-col bg-[#0A0A0A] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              AI Strategy Assistant
            </h3>
            <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">Case Intelligence Node // Secure</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* CHAT/RESULT AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {responses.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-red-600/5 rounded-full flex items-center justify-center mb-4 border border-red-600/10">
                  <span className="text-red-600 text-xl">◈</span>
                </div>
                <p className="text-xs font-mono uppercase tracking-widest text-gray-600">Awaiting Query Input...</p>
                <p className="text-[10px] text-gray-700 mt-2 max-w-[200px]">Ask for document summaries, risk analysis, or case timelines.</p>
              </div>
            ) : (
              responses.map((r, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <AIResultBox 
                    title={idx === 0 ? "Latest Synthesis" : `Archive Log #${responses.length - idx}`} 
                    content={r} 
                    isLatest={idx === 0}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* INPUT AREA */}
        <div className="p-6 bg-black/40 border-t border-white/5">
          <div className="relative group">
            <textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              rows={2} 
              placeholder="Query the case intelligence..." 
              className="w-full p-4 pr-32 bg-[#111] text-sm text-slate-200 rounded-2xl border border-white/5 focus:border-red-600/50 outline-none transition-all resize-none placeholder:text-gray-700 font-sans"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button 
                onClick={() => { setResponses([]); toast("Archive Purged"); }} 
                className="p-2 text-[10px] uppercase font-bold text-gray-600 hover:text-gray-400 transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={handleSend} 
                disabled={loading || !input.trim()} 
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95"
              >
                {loading ? "Processing..." : "Run Analysis"}
              </button>
            </div>
          </div>
          <p className="mt-3 text-[9px] text-gray-700 font-mono text-center uppercase tracking-[0.2em]">
            AES-256 Case Intelligence Grounding Enabled
          </p>
        </div>
      </motion.div>
    </div>
  );
}