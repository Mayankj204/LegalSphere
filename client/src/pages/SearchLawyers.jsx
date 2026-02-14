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
      <div className="pt-32 px-4">
        <h1 className="text-4xl font-bold">Find Lawyers</h1>

        {/* SEARCH BAR */}
        <div className="mt-6 flex gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-[#111] border border-red-600/30 rounded w-80"
          />
          <button
            onClick={fetchLawyers}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Search
          </button>
        </div>

        {/* LAWYERS GRID */}
        {loading ? (
          <div className="mt-10">Loading lawyers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {lawyers.map((l) => (
              <LawyerCard key={l._id} lawyer={l} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
