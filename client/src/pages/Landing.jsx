import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] px-4 py-12 md:py-20 relative overflow-hidden font-sans">
      
      {/* SOFT BACKGROUND DEPTH */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/5 blur-[120px] pointer-events-none" />

      {/* HERO SECTION */}
      <div className="text-center max-w-4xl mx-auto mt-12 md:mt-24 relative z-10">
        <div className="inline-block px-4 py-1 bg-red-600/10 border border-red-600/20 rounded-full mb-8">
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
            Trusted by 5,000+ Clients // Hand-Verified Legal Experts
          </p>
        </div>

        <h1 className="text-6xl md:text-8xl font-black leading-[0.9] text-white tracking-tighter mb-8">
          LEGAL HELP. <br />
          <span className="block bg-gradient-to-b from-red-500 to-red-800 text-transparent bg-clip-text italic font-serif py-2">
            Made Simple.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The easiest way to find and work with top-rated lawyers. 
          Use our AI tools to understand your case and connect with the right expert in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/login"
            className="group inline-flex items-center px-10 py-5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-red-600/20 transition-all active:scale-95"
          >
            Find Your Lawyer
          </Link>
          <Link
            to="/register"
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            Are you a lawyer? Join the Registry
          </Link>
        </div>
      </div>

      {/* QUICK TRUST METRICS */}
      <div className="mt-24 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl">
          <p className="text-3xl font-light text-white mb-1">100%</p>
          <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Verified Profiles</p>
        </div>
        <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl">
          <p className="text-3xl font-light text-white mb-1">24/7</p>
          <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">AI Case Support</p>
        </div>
        <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl">
          <p className="text-3xl font-light text-white mb-1">FREE</p>
          <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Lawyer Matching</p>
        </div>
        <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl">
          <p className="text-3xl font-light text-white mb-1">SECURE</p>
          <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Private Chat</p>
        </div>
      </div>

      {/* USER-FOCUSED FEATURES */}
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto pb-24">

        <div className="group p-10 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] hover:border-red-600/30 transition-all duration-500">
          <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 text-red-500 text-xl font-bold">✓</div>
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors">Verified Experts</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Every lawyer on our platform is hand-verified. We check their credentials and experience so you can book with confidence.
          </p>
        </div>

        <div className="group p-10 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] hover:border-red-600/30 transition-all duration-500">
          <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 text-red-500 text-xl font-bold">✧</div>
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors">Smart Case Guide</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Not sure where to start? Our AI helps you organize your facts, understand the law, and prepares you for your first consultation.
          </p>
        </div>

        <div className="group p-10 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] hover:border-red-600/30 transition-all duration-500">
          <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 text-red-500 text-xl font-bold">🔒</div>
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors">Private & Safe</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your details are protected with bank-level security. We ensure your personal information and documents stay completely private.
          </p>
        </div>

      </div>
    </div>
  );
}