// client/src/components/ChatSidebar.jsx
import React, { useEffect, useState } from "react";
import { getAllDocuments } from "../services/documentService";

export default function ChatSidebar({ onSelect }) {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await getAllDocuments();
        setDocs(list);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="bg-[#111] text-white p-4 rounded-lg h-[60vh] overflow-y-auto border border-red-600/40">
      <h3 className="text-lg font-semibold mb-4">Documents</h3>

      {docs.length === 0 ? (
        <p className="text-gray-400 text-sm">No documents uploaded.</p>
      ) : (
        docs.map(doc => (
          <div
            key={doc._id}
            onClick={() => onSelect(doc)}
            className="cursor-pointer mb-3 p-3 bg-[#1a1a1a] rounded border border-transparent hover:border-red-600 transition"
          >
            <p className="font-medium">{doc.filename}</p>
            <p className="text-xs text-gray-500">
              {new Date(doc.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
