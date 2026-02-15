// src/pages/SearchLawyers.jsx
import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import LawyerCard from "../components/LawyerCard";
import { getAllLawyers } from "../services/lawyerService";

export default function SearchLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const data = await getAllLawyers(search);
      setLawyers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLawyers();
    // eslint-disable-next-line
  }, []);

  // Quick categories for the UI
  const categories = ["Criminal", "Corporate", "Family", "Civil", "Intellectual Property"];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-red-500/30">
        
        {/* HERO SECTION */}
        <div className="relative pt-20 pb-16 px-6 overflow-hidden">
          {/* Ambient Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-red-600/10 blur-[120px] rounded-full" />
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
              Find the Right <span className="text-red-600">Counsel</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Connect with top-tier legal professionals vetted for excellence. 
              Your journey to justice starts with the right advocate.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          
          {/* SEARCH BAR & FILTERS */}
          <div className="mb-16">
            <div className="flex flex-col items-center">
              <div className="flex w-full max-w-3xl bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden shadow-2xl focus-within:border-red-600/50 transition-all p-1">
                <div className="flex-1 flex items-center px-4">
                  <span className="text-gray-500 mr-2">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name, specialization, or firm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchLawyers()}
                    className="w-full py-4 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-600"
                  />
                </div>
                <button
                  onClick={fetchLawyers}
                  className="px-8 bg-red-600 hover:bg-red-500 transition-all font-bold text-xs uppercase tracking-widest text-white rounded-xl active:scale-95"
                >
                  Search
                </button>
              </div>

              {/* QUICK FILTERS */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSearch(cat); fetchLawyers(); }}
                    className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full border border-white/5 bg-white/5 text-gray-400 hover:border-red-600/40 hover:text-white transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-16" />

          {/* RESULTS GRID */}
          <div className="relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500">Querying Database...</p>
              </div>
            ) : lawyers.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">📂</div>
                <h3 className="text-xl font-medium text-white">No advocates matched your criteria</h3>
                <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">
                  Try adjusting your search terms or exploring a broader specialization category.
                </p>
                <button 
                  onClick={() => { setSearch(""); fetchLawyers(); }}
                  className="mt-6 text-red-500 text-xs font-bold uppercase tracking-widest border-b border-red-500/20 pb-1 hover:text-red-400 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {lawyers.map((l) => (
                  <div key={l._id} className="hover:translate-y-[-4px] transition-transform duration-300">
                    <LawyerCard lawyer={l} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM DECORATION */}
        <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />
      </div>
    </PageTransition>
  );
}