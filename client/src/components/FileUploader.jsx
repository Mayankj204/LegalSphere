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
        flex flex-col items-center justify-center
        border-2 border-dashed rounded-xl p-8 cursor-pointer
        transition-all duration-300
        ${
          isDragOver
            ? "border-red-600 bg-[#111]"
            : "border-red-600/40 bg-[#0c0c0c]"
        }
      `}
    >
      <input
        type="file"
        hidden
        ref={inputRef}
        onChange={handleChange}
        accept=".pdf,.txt"
      />

      {!selectedFile ? (
        <div className="text-center">
          <p className="text-gray-300">
            <span className="text-red-500 font-semibold">Click to upload</span>{" "}
            or drag & drop
          </p>
          <p className="text-gray-500 text-sm mt-1">PDF or TXT only</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-red-400 font-semibold">{selectedFile.name}</p>
          <p className="text-gray-500 text-xs mt-1">
            {(selectedFile.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}
    </div>
  );
}
