// src/components/AIResultBox.jsx
const AIResultBox = ({ title, content }) => {
  return (
    <div className="bg-[#151515] border border-ls-border rounded-xl p-6 shadow-lg shadow-red-900/5">
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
        {content}
      </pre>
    </div>
  );
};

export default AIResultBox;
