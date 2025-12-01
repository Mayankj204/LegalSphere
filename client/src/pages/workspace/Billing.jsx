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
      return alert("Title and amount are required.");
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
      alert("Failed to add billing entry");
    }
  };

  const totalAmount = billing.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Billing</h2>

      {/* Add Billing Entry */}
      <div className="p-4 bg-[#111] rounded border border-red-600/20 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 bg-[#0d0d0d] border border-red-600/30 rounded"
            placeholder="Billing title (ex: Consultation)"
          />

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 bg-[#0d0d0d] border border-red-600/30 rounded"
            placeholder="Amount (₹)"
            type="number"
          />
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-3 p-3 bg-[#0d0d0d] border border-red-600/30 rounded"
          rows="3"
          placeholder="Description (optional)"
        />

        <button
          onClick={add}
          className="mt-3 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Add Entry
        </button>
      </div>

      {/* Total Billing */}
      <div className="mb-4 p-4 bg-[#111] rounded border border-red-600/20">
        <p className="text-gray-400 text-sm">Total Billing</p>
        <p className="text-3xl font-bold text-red-500 mt-1">₹ {totalAmount}</p>
      </div>

      {/* Billing List */}
      <div className="space-y-4">
        {loading && <p className="text-gray-400">Loading billing entries...</p>}

        {!loading && billing.length === 0 && (
          <p className="text-gray-500 text-sm">No billing entries yet.</p>
        )}

        {billing.map((entry) => (
          <div
            key={entry._id}
            className="p-4 bg-[#111] rounded border border-red-600/20"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold text-red-400">
                  {entry.title}
                </p>
                <p className="text-gray-300 mt-1 text-sm">
                  {entry.description || "No description"}
                </p>
              </div>

              <p className="text-xl font-bold text-green-400">
                ₹ {entry.amount}
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {new Date(entry.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
