// client/src/pages/workspace/Billing.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../../services/workspaceService";

export default function Billing({ caseId }) {
  const [billing, setBilling] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBilling();
    // eslint-disable-next-line
  }, [caseId]);

  const loadBilling = async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getBilling(caseId);
      setBilling(data || []);
    } catch (err) {
      console.error("Failed to fetch billing:", err);
      setBilling([]);
    } finally {
      setLoading(false);
    }
  };

  const add = async () => {
    if (!title.trim() || !amount.trim()) {
      return alert("System Error: Title and numerical amount are mandatory.");
    }

    try {
      await workspaceService.addBillingEntry(caseId, {
        title,
        amount: Number(amount),
        description,
      });

      setTitle("");
      setAmount("");
      setDescription("");
      loadBilling();
    } catch (err) {
      console.error("Add billing failed:", err);
      alert("Transaction failed to commit.");
    }
  };

  const totalAmount = billing.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="bg-[#050505] text-slate-200">
      
      {/* HEADER & SUMMARY STRIP */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full" />
            Financial Ledger
          </h2>
          <p className="text-[10px] text-gray-500 font-mono mt-1">CASE_REF: {caseId?.substring(0, 8)}</p>
        </div>

        <div className="bg-[#0A0A0A] border border-red-600/30 px-8 py-4 rounded-2xl shadow-lg shadow-red-600/5">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest text-right">Total Aggregate Billing</p>
          <p className="text-3xl font-light text-white mt-1">
            <span className="text-red-600 font-bold mr-1">₹</span>
            {totalAmount.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* TRANSACTION ENTRY FORM */}
      <div className="p-8 bg-[#0A0A0A] rounded-3xl border border-white/5 mb-10 shadow-2xl">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Create New Billing Entry</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block ml-1">Service Description</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3.5 bg-black border border-white/10 rounded-xl text-sm focus:border-red-600/50 outline-none placeholder:text-gray-700"
              placeholder="e.g., Senior Counsel Consultation"
            />
          </div>

          <div>
            <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block ml-1">Amount (INR)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3.5 bg-black border border-white/10 rounded-xl text-sm focus:border-red-600/50 outline-none"
              placeholder="0.00"
              type="number"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block ml-1">Additional Metadata (Notes)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 bg-black border border-white/10 rounded-xl text-sm focus:border-red-600/50 outline-none resize-none placeholder:text-gray-700 font-sans"
            rows="2"
            placeholder="Detailed breakdown of charges..."
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={add}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95"
          >
            Post Entry
          </button>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Recent Transactions</h3>
        
        {loading ? (
          <div className="py-20 text-center font-mono text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">
            Syncing Ledger...
          </div>
        ) : billing.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl text-gray-600 text-xs uppercase tracking-widest">
            No entries recorded in current period.
          </div>
        ) : (
          billing.map((entry) => (
            <div
              key={entry._id}
              className="group p-5 bg-[#0A0A0A] rounded-2xl border border-white/5 hover:border-red-600/20 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-white group-hover:text-red-500 transition-colors">
                      {entry.title}
                    </p>
                    <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded text-gray-500 font-mono">
                      TXN_{entry._id?.substring(entry._id.length - 4)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 max-w-xl line-clamp-1 italic">
                    {entry.description || "N/A"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-light text-white">
                    <span className="text-xs text-red-500 mr-1">₹</span>
                    {entry.amount?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[9px] text-gray-600 mt-1 uppercase font-mono tracking-tighter">
                    {new Date(entry.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-12 text-center text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">
        Verified Financial Audit Node | Encrypted Record
      </p>
    </div>
  );
}