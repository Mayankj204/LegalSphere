// src/components/LawyerCard.jsx
import { Link } from "react-router-dom";

export default function LawyerCard({ lawyer }) {
  return (
    <div className="bg-ls-charcoal/60 backdrop-blur-xl border border-ls-red/20 shadow-card rounded-lg-2 p-5 hover:shadow-glow transition-all">

      <h2 className="text-xl font-bold text-ls-offwhite">
        {lawyer.name}
      </h2>

      <p className="text-ls-muted mt-1">
        {lawyer.specialization}
      </p>

      <p className="mt-2 text-sm text-ls-offwhite/90">
        Experience: {lawyer.experience} years
      </p>

      <p className="text-ls-offwhite/80 text-sm">
        Location: {lawyer.city}
      </p>

      <Link
        to={`/lawyer/${lawyer._id}`}
        className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-ls-red to-ls-purple rounded-lg text-white font-medium hover:opacity-90 transition"
      >
        View Profile
      </Link>
    </div>
  );
}
