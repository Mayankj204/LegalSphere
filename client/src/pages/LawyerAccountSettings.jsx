// src/pages/LawyerAccountSettings.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import PageTransition from "../components/PageTransition";
import axios from "axios";

export default function LawyerAccountSettings() {
  const { user, setUser } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      city: user?.city || "",
      specialization: user?.specialization || "",
      experience: user?.experience || "",
      barCouncilId: user?.barCouncilId || "",
      consultationFee: user?.consultationFee || "",
      languages: Array.isArray(user?.languages) ? user.languages.join(", ") : "",
      practiceAreas: Array.isArray(user?.practiceAreas) ? user.practiceAreas.join(", ") : "",
      courts: Array.isArray(user?.courts) ? user.courts.join(", ") : "",
      education: Array.isArray(user?.education) ? user.education.join(", ") : "",
      availability: user?.availability || "Available",
      bio: user?.bio || "",
      officeAddress: user?.officeAddress || "",
      enrolledYear: user?.enrolledYear || "",
      casesHandled: user?.casesHandled || "",
      successRate: user?.successRate || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const token = localStorage.getItem("token");

      ["languages", "practiceAreas", "courts", "education"].forEach((field) => {
        if (data[field]) {
          data[field] = data[field].split(",").map((item) => item.trim()).filter(Boolean);
        }
      });

      const res = await axios.put("http://localhost:5000/api/auth/update-profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setSuccess("Professional profile synchronized successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update credentials.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = "w-full mt-1.5 p-3.5 bg-black border border-white/5 text-slate-200 rounded-xl focus:outline-none focus:border-red-600/50 transition-all text-sm placeholder:text-gray-600";
  const labelStyle = "text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1";

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-red-500/30 pb-20">
        
        {/* HEADER */}
        <div className="max-w-7xl mx-auto px-8 pt-12 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">Professional Credentials</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Manage your public attorney profile and practice details</p>
        </div>

        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-12 gap-10">

          {/* LEFT COLUMN: IDENTITY CARD */}
          <div className="lg:col-span-3">
            <div className="sticky top-28 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 text-center overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-600/10 blur-[50px] rounded-full -z-10" />
              
              <div className="relative inline-block">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#111] border-2 border-red-600/20 flex items-center justify-center text-3xl font-light text-white shadow-2xl">
                  {user?.name?.charAt(0)}
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-4 border-[#0A0A0A] rounded-full"></div>
              </div>

              <h2 className="text-xl font-semibold text-white mt-6">{user?.name}</h2>
              <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase tracking-tighter">{user?.specialization || 'Legal Consultant'}</p>
              
              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                  <span className="text-gray-500">Practice Type</span>
                  <span className="text-red-500 font-bold">Verified Attorney</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                  <span className="text-gray-500">Exp. Level</span>
                  <span className="text-white">{user?.experience} Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM GRID */}
          <div className="lg:col-span-9">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl">
              
              {success && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-medium animate-fade-in">✓ {success}</div>}
              {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">✕ {error}</div>}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                
                {/* SECTION 1: BASIC INFORMATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="col-span-1 lg:col-span-2">
                    <label className={labelStyle}>Legal Full Name</label>
                    <input {...register("name")} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Practice Status</label>
                    <select {...register("availability")} className={inputStyle}>
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelStyle}>Contact Number</label>
                    <input {...register("phone")} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Base City</label>
                    <input {...register("city")} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Bar Council ID</label>
                    <input {...register("barCouncilId")} className={inputStyle} />
                  </div>
                </div>

                {/* SECTION 2: PROFESSIONAL STANDING */}
                <div>
                  <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-2">Professional Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <label className={labelStyle}>Experience (Yrs)</label>
                      <input type="number" {...register("experience")} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Fee (Per Hour)</label>
                      <input type="number" {...register("consultationFee")} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Total Cases</label>
                      <input type="number" {...register("casesHandled")} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Win Rate (%)</label>
                      <input type="number" {...register("successRate")} className={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: EXPERTISE & QUALIFICATIONS */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelStyle}>Core Specialization</label>
                    <input {...register("specialization")} className={inputStyle} placeholder="e.g. Criminal Defense" />
                  </div>
                  <div>
                    <label className={labelStyle}>Office / Firm Address</label>
                    <input {...register("officeAddress")} className={inputStyle} />
                  </div>
                  <div className="col-span-full grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelStyle}>Practice Areas (Tags)</label>
                      <textarea {...register("practiceAreas")} rows="2" className={`${inputStyle} resize-none`} placeholder="Corporate, Civil, Real Estate..." />
                    </div>
                    <div>
                      <label className={labelStyle}>Court Jurisdictions</label>
                      <textarea {...register("courts")} rows="2" className={`${inputStyle} resize-none`} placeholder="Supreme Court, High Court, NCLT..." />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: BIO */}
                <div>
                  <label className={labelStyle}>Professional Biography</label>
                  <textarea {...register("bio")} rows="5" className={`${inputStyle} resize-none`} placeholder="Detail your legal background and notable achievements..." />
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full md:w-64 py-4 bg-red-600 hover:bg-red-500 transition-all text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-red-600/10 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {saving ? "Processing..." : "Update Credentials"}
                  </button>
                </div>

              </form>
            </div>
            <p className="mt-8 text-center text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">Verified Attorney Data Node: {user?._id}</p>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}