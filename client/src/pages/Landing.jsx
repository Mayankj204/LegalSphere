import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="px-4">

      {/* HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto mt-16 md:mt-28">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
          Find the Right
          <span className="block bg-gradient-to-r from-red-500 to-red-700 text-transparent bg-clip-text mt-2">
            Lawyer for Your Case
          </span>
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          AI-powered platform to connect you with verified legal professionals.
        </p>

        <Link
          to="/login"
          className="inline-block mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 transition text-white font-semibold rounded-lg shadow-lg shadow-red-600/30"
        >
          Get Started
        </Link>
      </div>

      {/* FEATURES GRID */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        <div className="p-6 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
          <h3 className="text-xl font-bold text-white">Verified Lawyers</h3>
          <p className="text-gray-400 mt-2">
            Access top legal professionals with verified backgrounds.
          </p>
        </div>

        <div className="p-6 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
          <h3 className="text-xl font-bold text-white">AI Legal Tools</h3>
          <p className="text-gray-400 mt-2">
            Summaries, insights, predictions & more powered by intelligent AI.
          </p>
        </div>

        <div className="p-6 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
          <h3 className="text-xl font-bold text-white">Secure Storage</h3>
          <p className="text-gray-400 mt-2">
            Your case files are protected with strong encryption.
          </p>
        </div>

      </div>
    </div>
  );
}
