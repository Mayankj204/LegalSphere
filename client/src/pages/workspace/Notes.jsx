// client/src/pages/workspace/Notes.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../../services/workspaceService";

export default function Notes({ caseId }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line
  }, [caseId]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getCaseNotes(caseId);
      setNotes(data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const add = async () => {
    if (!text.trim()) return alert("Note cannot be empty.");

    try {
      await workspaceService.addNote(caseId, { text });
      setText("");
      loadNotes();
    } catch (err) {
      console.error("Add note failed:", err);
      alert("Failed to add note");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Case Notes</h2>

      {/* Add Note Box */}
      <div className="flex gap-3 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-3 bg-[#111] border border-red-600/30 rounded"
          placeholder="Write a note..."
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Add
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {loading && <p className="text-gray-400">Loading notes...</p>}

        {!loading && notes.length === 0 && (
          <p className="text-gray-500 text-sm">No notes yet.</p>
        )}

        {notes.map((n) => (
          <div
            key={n._id}
            className="p-3 bg-[#111] rounded border border-red-600/20"
          >
            <p className="text-gray-300">{n.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
