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
  }, []);

  return (
    <PageTransition>
      <div className="pt-3 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* HERO */}
          <div className="text-center mb-14">
            <h1 className="text-5xl font-bold text-white">
              Find the Right Lawyer
            </h1>
            <p className="text-gray-400 mt-4 text-lg">
              Search experienced professionals based on your legal needs.
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex justify-center mb-14">
            <div className="flex w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl overflow-hidden shadow-lg shadow-red-600/10">
              <input
                type="text"
                placeholder="Search by name, specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-6 py-4 bg-transparent text-white focus:outline-none"
              />
              <button
                onClick={fetchLawyers}
                className="px-8 bg-red-600 hover:bg-red-700 transition font-semibold text-white"
              >
                Search
              </button>
            </div>
          </div>

          {/* RESULTS */}
          {loading ? (
            <div className="text-center text-gray-400 mt-20 text-lg">
              Loading lawyers...
            </div>
          ) : lawyers.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <h3 className="text-2xl font-semibold">
                No lawyers found
              </h3>
              <p className="mt-2">
                Try searching with a different keyword.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {lawyers.map((l) => (
                <LawyerCard key={l._id} lawyer={l} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
