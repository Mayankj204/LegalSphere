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
      <div className="max-w-3xl mx-auto bg-ls-charcoal/60 backdrop-blur-xl border border-ls-red/20 rounded-xl p-8 shadow-lg text-center">

        {/* PROFILE IMAGE */}
        <div className="flex justify-center mb-6">
          <img
            src={
              lawyer.profileImage
                ? `http://localhost:5000/uploads/${lawyer.profileImage}`
                : "https://via.placeholder.com/200"
            }
            alt={lawyer.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-ls-red shadow-md"
          />
        </div>

        {/* NAME */}
        <h1 className="text-3xl font-bold text-ls-offwhite">
          {lawyer.name}
        </h1>

        {/* SPECIALIZATION */}
        <p className="mt-2 text-ls-muted text-lg">
          {lawyer.specialization}
        </p>

        {/* DETAILS */}
        <div className="mt-6 space-y-2 text-ls-offwhite/90">
          <p><span className="font-semibold">Experience:</span> {lawyer.experience} years</p>
          <p><span className="font-semibold">City:</span> {lawyer.city}</p>
          <p><span className="font-semibold">Email:</span> {lawyer.email}</p>
          {lawyer.phone && (
            <p><span className="font-semibold">Phone:</span> {lawyer.phone}</p>
          )}
        </div>

        {/* BIO */}
        {lawyer.bio && (
          <div className="mt-6 text-ls-offwhite/80 leading-relaxed">
            <h3 className="font-semibold mb-2 text-lg">About</h3>
            <p>{lawyer.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
