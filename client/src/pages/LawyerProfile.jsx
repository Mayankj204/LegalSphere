import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLawyerById } from "../services/lawyerService";

export default function LawyerProfile() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const data = await getLawyerById(id);
        setLawyer(data);
      } catch (err) {
        console.error("Failed to fetch lawyer", err);
      }
    };
    fetchLawyer();
  }, [id]);

  if (!lawyer)
    return (
      <div className="pt-32 text-center text-gray-400">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Profile Card */}
        <div className="bg-[#111] border border-red-600/30 rounded-2xl shadow-xl p-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-6">

            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-3xl font-bold">
              {lawyer.name?.charAt(0)}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-red-500">
                {lawyer.name}
              </h1>

              <p className="text-gray-400 mt-1">
                {lawyer.specialization}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="bg-[#1a1a1a] px-3 py-1 rounded-lg border border-red-600/20">
                  🎓 Experience: {lawyer.experience} years
                </span>

                <span className="bg-[#1a1a1a] px-3 py-1 rounded-lg border border-red-600/20">
                  📍 {lawyer.city}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-red-600/20 my-8"></div>

          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

            <p className="text-gray-300">
              📧 Email:{" "}
              <span className="text-red-400">{lawyer.email}</span>
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-red-600/20 my-8"></div>

          {/* About Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About</h2>

            <p className="text-gray-400 leading-relaxed">
              {lawyer.bio || "This lawyer has not added a bio yet."}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-600/20">
              Contact Lawyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
