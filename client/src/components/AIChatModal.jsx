// src/components/AIChatModal.jsx
import { useState } from "react";
import AIResultBox from "./AIResultBox";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AIChatModal({ open, onClose, initialContext = "" }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);

  if (!open) return null;

  const handleSend = async () => {
    if (!input.trim()) {
      toast.error("Please type a question.");
      return;
    }
    setLoading(true);
    // Mock delay + response
    setTimeout(() => {
      const mock = `AI: Key points for "${input}" — (demo) 1) Point A 2) Point B 3) Suggestion.`;
      setResponses((r) => [mock, ...r]);
      setInput("");
      setLoading(false);
      toast.success("AI generated summary (demo)");
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 w-full max-w-2xl p-6 bg-ls-charcoal/70 backdrop-blur-xl border border-ls-red/10 rounded-lg-2 shadow-glow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">AI Case Assistant</h3>
          <button onClick={onClose} className="text-ls-muted">Close</button>
        </div>

        <div className="mb-4">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} placeholder="Ask the AI about the case — e.g., summarize key points" className="w-full p-3 bg-ls-darkgrey rounded-lg border border-ls-red/10"></textarea>
        </div>

        <div className="flex gap-3 items-center">
          <button onClick={handleSend} disabled={loading} className="px-4 py-2 bg-ls-red text-white rounded-lg font-semibold">
            {loading ? "Thinking..." : "Ask AI"}
          </button>
          <button onClick={() => { setResponses([]); toast("Cleared"); }} className="px-3 py-2 border border-ls-red/10 rounded-lg text-ls-muted">Clear</button>
        </div>

        <div className="mt-6 space-y-4">
          {responses.length === 0 ? <p className="text-ls-muted">No responses yet — try asking the AI.</p> : responses.map((r, idx) => <AIResultBox key={idx} title={`Response #${responses.length - idx}`} content={r} />)}
        </div>
      </motion.div>
    </div>
  );
}
