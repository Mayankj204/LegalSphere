// src/components/FileUploader.jsx
import { useRef, useState } from "react";

export default function FileUploader({ onFileSelect }) {
  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setDragOver] = useState(false);

  const handleSelect = (file) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleSelect(file);
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`
        relative group flex flex-col items-center justify-center
        border-2 border-dashed rounded-[2rem] p-12 cursor-pointer
        transition-all duration-500 overflow-hidden
        ${
          isDragOver
            ? "border-red-600 bg-red-600/5 shadow-[0_0_40px_rgba(220,38,38,0.1)]"
            : "border-white/10 bg-[#0A0A0A] hover:border-red-600/40"
        }
      `}
    >
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

      <input
        type="file"
        hidden
        ref={inputRef}
        onChange={handleChange}
        accept=".pdf,.txt,.doc,.docx"
      />

      {!selectedFile ? (
        <div className="text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-red-600/50 transition-colors">
             <span className="text-2xl group-hover:scale-110 transition-transform duration-300 text-gray-400 group-hover:text-red-500">
               ⇪
             </span>
          </div>
          
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
            Secure <span className="text-red-600">Intake</span> Portal
          </p>
          
          <div className="mt-4 space-y-1">
            <p className="text-xs text-gray-500 font-medium">
              Drag evidence here or <span className="text-red-500 underline underline-offset-4">browse files</span>
            </p>
            <p className="text-[10px] text-gray-700 font-mono uppercase tracking-widest mt-2">
              Allowed: PDF, TXT, DOCX (MAX 25MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center relative z-10 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-600/30">
             <span className="text-red-500 text-xs font-black font-mono">
               {selectedFile.name.split('.').pop().toUpperCase()}
             </span>
          </div>
          
          <p className="text-sm font-bold text-white tracking-tight truncate max-w-[240px] mx-auto">
            {selectedFile.name}
          </p>
          
          <div className="flex items-center justify-center gap-3 mt-2">
            <p className="text-[10px] text-gray-600 font-mono">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
              Ready for Encryption
            </p>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
            className="mt-6 text-[9px] uppercase font-black text-gray-600 hover:text-red-500 transition-colors tracking-[0.2em]"
          >
            Remove Record
          </button>
        </div>
      )}

      {/* FOOTER LABEL */}
      <div className="absolute bottom-4 text-[8px] text-gray-800 font-mono uppercase tracking-[0.3em]">
        End-to-End Encrypted Tunnel Active
      </div>
    </div>
  );
}