// src/pages/ClientAccountSettings.jsx
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import PageTransition from "../components/PageTransition";
import api from "../services/api";

export default function ClientAccountSettings() {
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
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          address: data.address || "",
          about: data.about || "",
        });

        setProfileImage(data.profileImage || null);
        setUser(data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    fetchProfile();
  }, [reset, setUser]);

  /* ================= HANDLE IMAGE CHANGE ================= */
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
      console.error(err);
      setError("Failed to upload image.");
    }
  };

  /* ================= REMOVE IMAGE ================= */
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

  const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.name}&background=111&color=fff`;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 pb-20">

        <div className="max-w-6xl mx-auto px-8 pt-12 mb-10">
          <h1 className="text-3xl font-bold text-white">Security & Profile</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Manage your digital identity
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-8 grid lg:grid-cols-12 gap-10">

          {/* LEFT PROFILE CARD */}
          <div className="lg:col-span-4">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 text-center">

              <div className="relative inline-block">
                <img
                  src={profileImage || defaultAvatar}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-red-600/30"
                />
              </div>

              <div className="mt-4 space-y-2">
                <label className="cursor-pointer text-xs text-red-500 hover:underline">
                  Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>

                {profileImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="block text-xs text-gray-500 hover:text-red-400"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              <h2 className="text-xl font-semibold text-white mt-6">
                {user?.name}
              </h2>
              <p className="text-xs text-gray-500">{user?.email}</p>
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

                <div>
                  <label className="text-xs text-gray-400">Full Name</label>
                  <input {...register("name")} className={inputStyle} />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Phone</label>
                  <input {...register("phone")} className={inputStyle} />
                </div>

                <div>
                  <label className="text-xs text-gray-400">City</label>
                  <input {...register("city")} className={inputStyle} />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Address</label>
                  <input {...register("address")} className={inputStyle} />
                </div>

                <div>
                  <label className="text-xs text-gray-400">About</label>
                  <textarea
                    {...register("about")}
                    rows="4"
                    className={`${inputStyle} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Save Changes"}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
