// src/pages/LawyerAccountSettings.jsx
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import PageTransition from "../components/PageTransition";
import api from "../services/api";

const SPECIALIZATIONS = [
  "Criminal Law", "Civil Law", "Corporate Law", "Family / Divorce Law",
  "Real Estate Law", "Intellectual Property", "Taxation Law", "Cyber Law",
  "Constitutional Law", "Labour Law", "Other",
];

const PRACTICE_AREAS = [
  "Litigation", "Arbitration", "Corporate Advisory", "Contract Drafting",
  "Legal Notices", "Property Disputes", "Matrimonial Cases", "Startup Advisory",
];

const COURTS = [
  "Supreme Court", "High Court", "District Court", "Family Court",
  "NCLT", "Consumer Court", "Arbitration Tribunal",
];

export default function LawyerAccountSettings() {
  const { user, setUser } = useContext(AuthContext);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  /* ================= FETCH LATEST PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        const data = res.data;

        reset({
          name: data.name || "",
          phone: data.phone || "",
          city: data.city || "",
          specialization: data.specialization || "",
          experience: data.experience || "",
          consultationFee: data.consultationFee || "",
          availability: data.availability || "Available",
          bio: data.bio || "",
          practiceAreas: data.practiceAreas || "",
          courts: data.courts || "",
        });

        setProfileImage(data.profileImage || null);
        setUser(data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    fetchProfile();
  }, [reset, setUser]);

  /* ================= IMAGE HANDLERS ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await api.put("/auth/update-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfileImage(res.data.profileImage);
      setUser(res.data);
      setSuccess("Profile image updated.");
    } catch (err) {
      setError("Failed to upload image.");
    }
  };

  const handleRemoveImage = async () => {
    try {
      const res = await api.put("/auth/remove-profile-image");
      setProfileImage(null);
      setUser(res.data);
      setSuccess("Profile image removed.");
    } catch (err) {
      setError("Failed to remove image.");
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const res = await api.put("/auth/update-profile", data);

      setUser(res.data);
      setSuccess("Professional profile updated successfully.");
    } catch (err) {
      setError("Failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full mt-1.5 p-3.5 bg-black border border-white/5 text-slate-200 rounded-xl focus:outline-none focus:border-red-600/50 transition-all text-sm placeholder:text-gray-600";

  const labelStyle = "text-xs text-gray-400";

  const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.name}&background=111&color=fff`;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 pb-20">
        
        <div className="max-w-6xl mx-auto px-8 pt-12 mb-10">
          <h1 className="text-3xl font-bold text-white">Professional Settings</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Manage your legal practice identity
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-8 grid lg:grid-cols-12 gap-10">
          
          {/* LEFT PROFILE CARD */}
          <div className="lg:col-span-4">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 text-center">
              <div className="relative inline-block">
                <img
                  src={profileImage ? `http://localhost:5000${profileImage}` : defaultAvatar}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-red-600/30"
                />
              </div>

              <div className="mt-4 space-y-2">
                <label className="cursor-pointer text-xs text-red-500 hover:underline">
                  Change Photo
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </label>

                {profileImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="block w-full text-xs text-gray-500 hover:text-red-400"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              <h2 className="text-xl font-semibold text-white mt-6">{user?.name}</h2>
              <p className="text-xs text-gray-500 italic">
                {user?.specialization || "Legal Professional"}
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:col-span-8">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
              
              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs">
                  ✓ {success}
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                  ✕ {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* NAME & PHONE */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Full Name</label>
                    <input {...register("name")} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Phone Number</label>
                    <input {...register("phone")} className={inputStyle} />
                  </div>
                </div>

                {/* SPECIALIZATION & PRACTICE AREA */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Specialization</label>
                    <select {...register("specialization")} className={inputStyle}>
                      <option value="">Select Category</option>
                      {SPECIALIZATIONS.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelStyle}>Practice Area</label>
                    <select {...register("practiceAreas")} className={inputStyle}>
                      <option value="">Select Practice Area</option>
                      {PRACTICE_AREAS.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* COURTS & AVAILABILITY */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Primary Court</label>
                    <select {...register("courts")} className={inputStyle}>
                      <option value="">Select Court</option>
                      {COURTS.map((court) => (
                        <option key={court} value={court}>{court}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelStyle}>Availability Status</label>
                    <select {...register("availability")} className={inputStyle}>
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>

                {/* EXPERIENCE & FEES */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Experience (Years)</label>
                    <input type="number" {...register("experience")} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Consultation Fee (₹)</label>
                    <input type="number" {...register("consultationFee")} className={inputStyle} />
                  </div>
                </div>

                {/* BIO */}
                <div>
                  <label className={labelStyle}>Professional Bio</label>
                  <textarea
                    {...register("bio")}
                    rows="4"
                    className={`${inputStyle} resize-none`}
                    placeholder="Briefly describe your legal background..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-all shadow-lg shadow-red-900/20"
                >
                  {saving ? "Updating..." : "Save Professional Changes"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}