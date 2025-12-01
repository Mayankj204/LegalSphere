import React from "react";

export default function NoteCard({ note }) {
  return (
    <div className="p-3 bg-[#111] rounded border border-red-600/20">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-300">{note.text}</p>
          <p className="text-xs text-gray-500 mt-2">{new Date(note.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
