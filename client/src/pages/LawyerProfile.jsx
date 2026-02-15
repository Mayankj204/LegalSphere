import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLawyerById } from "../services/lawyerService";

export default function LawyerProfile() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const data = await getLawyerById(id);
        setLawyer(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchLawyer();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-400">
        Loading lawyer profile...
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="pt-32 text-center text-red-500">
        Lawyer not found
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto bg-ls-charcoal/60 backdrop-blur-xl border border-ls-red/20 rounded-xl p-8 shadow-lg">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-8">

          <img
            src={
              lawyer.profileImage
                ? `http://localhost:5000/uploads/${lawyer.profileImage}`
                : "https://via.placeholder.com/200"
            }
            alt={lawyer.name}
            className="w-44 h-44 rounded-full object-cover border-4 border-ls-red shadow-md"
          />

          <div>
            <h1 className="text-3xl font-bold text-ls-offwhite">
              {lawyer.name}
              {lawyer.isVerified && (
                <span className="ml-3 text-green-400 text-sm">
                  ✔ Verified
                </span>
              )}
            </h1>

            <p className="text-ls-muted mt-1 text-lg">
              {lawyer.specialization}
            </p>

            <p className="mt-2 text-ls-offwhite/80">
              {lawyer.experience} Years Experience
            </p>

            <p className="text-ls-offwhite/80">
              📍 {lawyer.city}
            </p>

            {lawyer.availability && (
              <p className="mt-2 text-sm font-semibold text-green-400">
                {lawyer.availability}
              </p>
            )}
          </div>
        </div>

        {/* QUICK INFO */}
        <div className="grid md:grid-cols-3 gap-6 mt-10 text-center">
          {lawyer.consultationFee && (
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-ls-muted text-sm">Consultation Fee</p>
              <p className="text-lg font-bold text-ls-offwhite">
                ₹{lawyer.consultationFee}
              </p>
            </div>
          )}

          {lawyer.casesHandled && (
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-ls-muted text-sm">Cases Handled</p>
              <p className="text-lg font-bold text-ls-offwhite">
                {lawyer.casesHandled}+
              </p>
            </div>
          )}

          {lawyer.successRate && (
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-ls-muted text-sm">Success Rate</p>
              <p className="text-lg font-bold text-ls-offwhite">
                {lawyer.successRate}%
              </p>
            </div>
          )}
        </div>

        {/* PRACTICE AREAS */}
        {lawyer.practiceAreas?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-ls-offwhite mb-3">
              Practice Areas
            </h3>
            <div className="flex flex-wrap gap-3">
              {lawyer.practiceAreas.map((area, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-ls-red/20 rounded-full text-sm text-ls-offwhite"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* COURTS */}
        {lawyer.courts?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-ls-offwhite mb-3">
              Courts Practiced In
            </h3>
            <ul className="list-disc list-inside text-ls-offwhite/80">
              {lawyer.courts.map((court, index) => (
                <li key={index}>{court}</li>
              ))}
            </ul>
          </div>
        )}

        {/* EDUCATION */}
        {lawyer.education?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-ls-offwhite mb-3">
              Education
            </h3>
            <ul className="list-disc list-inside text-ls-offwhite/80">
              {lawyer.education.map((edu, index) => (
                <li key={index}>{edu}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ABOUT */}
        {lawyer.bio && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-ls-offwhite mb-3">
              About
            </h3>
            <p className="text-ls-offwhite/80 leading-relaxed">
              {lawyer.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
