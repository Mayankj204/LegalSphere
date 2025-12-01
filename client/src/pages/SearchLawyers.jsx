// src/pages/SearchLawyers.jsx

import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import LawyerCard from "../components/LawyerCard";

export default function SearchLawyers() {
  const [loading, setLoading] = useState(true);
  const [lawyers, setLawyers] = useState([]);

  // Mock data – backend will replace
  const demoLawyers = [
    {
      _id: "1",
      name: "Amit Sharma",
      specialization: "Criminal Law",
      experience: "8 years",
      city: "Delhi",
    },
    {
      _id: "2",
      name: "Priya Mehta",
      specialization: "Corporate Law",
      experience: "5 years",
      city: "Mumbai",
    },
    {
      _id: "3",
      name: "Rahul Verma",
      specialization: "Cyber Law",
      experience: "6 years",
      city: "Bengaluru",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLawyers(demoLawyers);
      setLoading(false);
    }, 900);
  }, []);

  return (
    <PageTransition>
      <div className="pt-32 px-4">
        <h1 className="text-4xl font-extrabold text-ls-offwhite">Find Lawyers</h1>
        <p className="mt-2 text-ls-muted">
          Browse through verified legal professionals based on your needs.
        </p>

        {/* Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-6 bg-ls-charcoal/40 rounded-lg-2 shadow-card border border-ls-red/10 animate-pulse"
              >
                <div className="h-5 bg-ls-darkgrey rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-ls-darkgrey rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-ls-darkgrey rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          // Final Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {lawyers.map((l) => (
              <LawyerCard key={l._id} lawyer={l} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
