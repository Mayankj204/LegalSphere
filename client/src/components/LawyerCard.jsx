// src/components/LawyerCard.jsx
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function LawyerCard({ lawyer }) {
  const { user } = useContext(AuthContext);

  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const sendRequest = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/requests",
        { lawyerId: lawyer._id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Your request has been sent to the counsel.");
      setMessage("");

      setTimeout(() => {
        setOpenModal(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError("Unable to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6 hover:border-red-600/30 transition-all duration-500 group shadow-2xl">
        
        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <img
              src={lawyer.profileImage || "https://via.placeholder.com/150"}
              alt={lawyer.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-white/10 p-1 group-hover:border-red-600/50 transition-all duration-500"
            />
            {lawyer.isVerified && (
              <div className="absolute bottom-1 right-1 bg-red-600 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center shadow-lg">
                <span className="text-[8px] text-white">✓</span>
              </div>
            )}
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight group-hover:text-red-500 transition-colors">
            {lawyer.name}
          </h2>
          <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">
            {lawyer.specialization}
          </p>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-6">
          <div className="text-center">
            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Experience</p>
            <p className="text-xs text-white mt-1">{lawyer.experience}y</p>
          </div>
          <div className="text-center border-l border-white/5">
            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Location</p>
            <p className="text-xs text-white mt-1">{lawyer.city}</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">
          <Link
            to={`/lawyer/${lawyer._id}`}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl text-center transition-all border border-white/5"
          >
            View Full Profile
          </Link>

          {user?.role === "client" && (
            <button
              onClick={() => setOpenModal(true)}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95"
            >
              Contact Lawyer
            </button>
          )}
        </div>
      </div>

      {/* REQUEST MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] px-6">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-fade-in">
            <h3 className="text-xl font-light text-white mb-2 tracking-tight text-center">Consultation Request</h3>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center mb-8">Direct Message to {lawyer.name}</p>

            <textarea
              rows="4"
              placeholder="Briefly describe your situation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-800 resize-none"
            />

            {success && <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter mt-4 text-center">{success}</p>}
            {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-4 text-center">{error}</p>}

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setOpenModal(false)}
                className="px-6 py-2 text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors"
              >
                Discard
              </button>

              <button
                onClick={sendRequest}
                disabled={!message.trim() || loading}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-30 active:scale-95"
              >
                {loading ? "Syncing..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}