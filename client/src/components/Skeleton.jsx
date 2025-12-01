// src/components/Skeleton.jsx
export default function Skeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-ls-darkgrey/60 rounded-full animate-pulse w-full"></div>
      ))}
    </div>
  );
}
