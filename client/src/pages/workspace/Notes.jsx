// client/src/pages/workspace/Notes.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../../services/workspaceService";

export default function Notes({ caseId }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (caseId) loadNotes();
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

  const addOrUpdate = async () => {
    if (!text.trim()) return;

    try {
      if (editingId) {
        await workspaceService.updateNote(caseId, editingId, { text });
        setEditingId(null);
      } else {
        await workspaceService.addNote(caseId, { text });
      }

      setText("");
      loadNotes();
    } catch (err) {
      console.error("Save note failed:", err);
    }
  };

  const editNote = (note) => {
    setEditingId(note._id);
    setText(note.text);
  };

  const deleteNote = async (noteId) => {
    const ok = window.confirm("Delete this note?");
    if (!ok) return;

    try {
      await workspaceService.deleteNote(caseId, noteId);
      loadNotes();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="text-slate-200">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Case Notes</h2>
        <p className="text-sm text-gray-400">
          Add internal notes related to this case
        </p>
      </div>

      {/* Add Note Box */}
      <div className="mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
          className="w-full p-4 bg-[#111] border border-gray-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none min-h-[100px]"
        />

        <div className="flex justify-end mt-3 gap-3">
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setText("");
              }}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          )}

          <button
            onClick={addOrUpdate}
            disabled={!text.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {editingId ? "Update Note" : "Add Note"}
          </button>
        </div>
      </div>

      {/* Notes List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading notes...
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-700 rounded-lg">
          No notes added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((n) => (
            <div
              key={n._id}
              className="bg-[#111] border border-gray-800 p-5 rounded-lg"
            >
              <div className="flex justify-between items-center mb-3 text-xs text-gray-400">
                <span>
                  {new Date(n.createdAt).toLocaleDateString()}{" "}
                  {new Date(n.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                <div className="flex gap-4">
                  <button
                    onClick={() => editNote(n)}
                    className="text-yellow-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(n._id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-300">{n.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
