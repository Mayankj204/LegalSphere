// src/pages/ClientAccountSettings.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import PageTransition from "../components/PageTransition";
import axios from "axios";

export default function ClientAccountSettings() {
  const { user, setUser } = useContext(AuthContext);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "",
      address: user?.address || "",
      about: user?.about || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      setSuccess("Profile synchronized successfully.");
    } catch (err) {
      console.error(err);
      setError("System failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full mt-1.5 p-3.5 bg-black border border-white/5 text-slate-200 rounded-xl focus:outline-none focus:border-red-600/50 transition-all text-sm placeholder:text-gray-600";

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-red-500/30 pb-20">
        
        {/* HEADER */}
        <div className="max-w-6xl mx-auto px-8 pt-12 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">Security & Profile</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Manage your digital identity and contact records</p>
        </div>

        <div className="max-w-6xl mx-auto px-8 grid lg:grid-cols-12 gap-10">

          {/* LEFT COLUMN: IDENTITY CARD */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 text-center overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-600/10 blur-[50px] rounded-full -z-10" />
              
              <div className="relative inline-block">
                <div className="w-28 h-28 mx-auto rounded-full bg-[#111] border-2 border-red-600/20 flex items-center justify-center text-4xl font-light text-white shadow-2xl">
                  {user?.name?.charAt(0)}
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-4 border-[#0A0A0A] rounded-full"></div>
              </div>

              <h2 className="text-xl font-semibold text-white mt-6">{user?.name}</h2>
              <p className="text-xs font-mono text-gray-500 mt-1">{user?.email}</p>
              
              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                  <span className="text-gray-500">Account Type</span>
                  <span className="text-red-500 font-bold">Standard Client</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                  <span className="text-gray-500">Member Since</span>
                  <span className="text-white">Feb 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DATA ENTRY */}
          <div className="lg:col-span-8">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Personal Information</h2>

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-medium animate-fade-in">
                  ✓ {success}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
                  ✕ {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Legal Full Name</label>
                    <input {...register("name")} className={inputStyle} placeholder="e.g. Mayank Jaiswal" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Mobile Contact</label>
                    <input {...register("phone")} className={inputStyle} placeholder="+91 XXXXX-XXXXX" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Residential City</label>
                    <input {...register("city")} className={inputStyle} placeholder="e.g. New Delhi" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Postal Address</label>
                    <input {...register("address")} className={inputStyle} placeholder="Suite, Building, Street" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Bio / Profile Summary</label>
                  <textarea
                    {...register("about")}
                    rows="4"
                    className={`${inputStyle} resize-none`}
                    placeholder="Brief description for your assigned legal counsel..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 transition-all text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-red-600/10 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {saving ? "Processing..." : "Commit Changes"}
                  </button>
                </div>

              </form>
            </div>
            
            <p className="mt-8 text-center text-[10px] text-gray-600 font-mono uppercase tracking-widest">
              End-to-End Encrypted Profile Management
            </p>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}