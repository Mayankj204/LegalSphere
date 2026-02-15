import { Link } from "react-router-dom";

export default function LawyerCard({ lawyer }) {
  return (
    <div className="bg-ls-charcoal/60 backdrop-blur-xl border border-ls-red/20 shadow-card rounded-lg-2 p-5 hover:shadow-glow transition-all">

      {/* PROFILE IMAGE */}
      <div className="w-full flex justify-center mb-4">
        <img
          src={
            lawyer.profileImage
              ? lawyer.profileImage
              : "https://via.placeholder.com/150"
          }
          alt={lawyer.name}
          className="w-28 h-28 rounded-full object-cover border-2 border-ls-red shadow-md"
        />
      </div>

      <h2 className="text-xl font-bold text-ls-offwhite text-center">
        {lawyer.name}
      </h2>

      <p className="text-ls-muted mt-1 text-center">
        {lawyer.specialization}
      </p>

      <p className="mt-2 text-sm text-ls-offwhite/90 text-center">
        Experience: {lawyer.experience} years
      </p>

      <p className="text-ls-offwhite/80 text-sm text-center">
        Location: {lawyer.city}
      </p>

      <div className="flex justify-center">
        <Link
          to={`/lawyer/${lawyer._id}`}
          className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-ls-red to-ls-purple rounded-lg text-white font-medium hover:opacity-90 transition"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
