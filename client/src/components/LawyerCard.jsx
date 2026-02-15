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
        {
          lawyerId: lawyer._id,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Consultation request sent successfully!");
      setMessage("");

      setTimeout(() => {
        setOpenModal(false);
        setSuccess("");
      }, 1500);

    } catch (err) {
      setError("Failed to send request");
    }

    setLoading(false);
  };

  return (
    <>
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

        <div className="flex flex-col items-center gap-3 mt-4">
          <Link
            to={`/lawyer/${lawyer._id}`}
            className="px-4 py-2 bg-gradient-to-r from-ls-red to-ls-purple rounded-lg text-white font-medium hover:opacity-90 transition"
          >
            View Profile
          </Link>

          {/* Show only for logged-in CLIENT */}
          {user?.role === "client" && (
            <button
              onClick={() => setOpenModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
            >
              Request Consultation
            </button>
          )}
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-red-600/30 rounded-xl p-6 w-full max-w-md shadow-lg">

            <h3 className="text-xl font-semibold text-white mb-4">
              Send Consultation Request
            </h3>

            <textarea
              rows="4"
              placeholder="Briefly describe your case..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-black/60 border border-red-600/20 rounded-lg text-white focus:outline-none focus:border-red-600"
            />

            {success && (
              <p className="text-green-400 mt-3 text-sm">{success}</p>
            )}

            {error && (
              <p className="text-red-400 mt-3 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white"
              >
                Cancel
              </button>

              <button
                onClick={sendRequest}
                disabled={!message || loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
