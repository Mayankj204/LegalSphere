// client/src/pages/LawyerProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLawyerById } from "../services/lawyerService";
import PageTransition from "../components/PageTransition";

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
        console.error("Profile Retrieval Error:", err);
      }
      setLoading(false);
    };
    fetchLawyer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em]">Synchronizing Profile...</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 font-bold uppercase tracking-widest">
        Atorney Not Found // Registry Error
      </div>
    );
  }

  const labelStyle = "text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block";

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 pb-24 pt-32">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-10">

          {/* LEFT COLUMN: IDENTITY & PRIMARY ACTIONS */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 text-center shadow-2xl overflow-hidden relative group">
                {/* Profile Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
                
                <div className="relative inline-block mb-6">
                  <img
                    src={lawyer.profileImage ? `http://localhost:5000/uploads/${lawyer.profileImage}` : "https://via.placeholder.com/200"}
                    alt={lawyer.name}
                    className="w-40 h-40 rounded-full object-cover border-2 border-white/10 p-1 group-hover:border-red-600/50 transition-all duration-500 shadow-2xl"
                  />
                  {lawyer.isVerified && (
                    <div className="absolute bottom-2 right-2 bg-green-500 text-black p-1 rounded-full border-4 border-[#0A0A0A]" title="Verified Counsel">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-white tracking-tight">{lawyer.name}</h1>
                <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest mt-1">{lawyer.specialization}</p>
                
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-3">
                   <button className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 active:scale-95">
                     Book Consultation
                   </button>
                   <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5">
                     Secure Message
                   </button>
                </div>
              </div>

              {/* QUICK STATS */}
              <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center">
                  <p className="text-[8px] text-gray-600 uppercase font-black mb-1">Win Rate</p>
                  <p className="text-xl font-light text-white">{lawyer.successRate}%</p>
                </div>
                <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center">
                  <p className="text-[8px] text-gray-600 uppercase font-black mb-1">Experience</p>
                  <p className="text-xl font-light text-white">{lawyer.experience}y</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED CREDENTIALS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ABOUT / BIO */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 text-[40px] text-white/[0.02] font-black select-none">ABOUT</div>
               <span className={labelStyle}>Professional Biography</span>
               <p className="text-gray-400 leading-relaxed font-sans text-sm md:text-base">
                 {lawyer.bio || "No biography provided for this counsel."}
               </p>
               
               <div className="mt-10 grid md:grid-cols-2 gap-8">
                  <div>
                    <span className={labelStyle}>Consultation Fee</span>
                    <p className="text-2xl font-light text-white"><span className="text-red-600 font-bold mr-1">₹</span>{lawyer.consultationFee?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className={labelStyle}>Case Node Jurisdiction</span>
                    <p className="text-sm text-gray-300">{lawyer.city}, India</p>
                  </div>
               </div>
            </div>

            {/* EXPERTISE GRID */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* PRACTICE AREAS */}
              <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
                <span className={labelStyle}>Core Expertise</span>
                <div className="flex flex-wrap gap-2 mt-4">
                  {lawyer.practiceAreas?.map((area, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-red-600/5 border border-red-600/20 text-red-500 text-[9px] font-black uppercase tracking-tighter rounded-lg">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* COURTS */}
              <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
                <span className={labelStyle}>Court Admittance</span>
                <div className="space-y-3 mt-4">
                  {lawyer.courts?.map((court, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-red-600 rounded-full" />
                      <p className="text-[10px] text-gray-300 font-medium uppercase tracking-widest">{court}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* EDUCATION & ACADEMIC NODES */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
              <span className={labelStyle}>Academic Credentials</span>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {lawyer.education?.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                    <div className="text-lg opacity-20 group-hover:opacity-100 transition-opacity">🎓</div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">{edu}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        
        <p className="mt-20 text-center text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">
          Verified Attorney Node // LegalSphere Security Protocol Active
        </p>
      </div>
    </PageTransition>
  );
}