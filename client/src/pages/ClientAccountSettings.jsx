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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update global user state
      setUser(res.data);

      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }

    setSaving(false);
  };

  const inputStyle =
    "w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none focus:border-red-600";

  return (
    <PageTransition>
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">

          {/* PROFILE CARD */}
          <div className="p-6 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-red-600/20 flex items-center justify-center text-3xl font-bold text-white">
                {user?.name?.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-white mt-4">
                {user?.name}
              </h2>
              <p className="text-gray-400">{user?.email}</p>
              <span className="mt-3 inline-block px-3 py-1 text-sm bg-red-600/20 text-red-400 rounded-full">
                Client
              </span>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2 p-8 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
            <h2 className="text-2xl font-bold text-white mb-6">
              Account Settings
            </h2>

            {success && (
              <p className="mb-4 text-green-400 font-semibold">
                {success}
              </p>
            )}

            {error && (
              <p className="mb-4 text-red-400 font-semibold">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div>
                <label className="text-gray-300 text-sm">Full Name</label>
                <input {...register("name")} className={inputStyle} />
              </div>

              <div>
                <label className="text-gray-300 text-sm">Phone</label>
                <input {...register("phone")} className={inputStyle} />
              </div>

              <div>
                <label className="text-gray-300 text-sm">City</label>
                <input {...register("city")} className={inputStyle} />
              </div>

              <div>
                <label className="text-gray-300 text-sm">Address</label>
                <input {...register("address")} className={inputStyle} />
              </div>

              <div>
                <label className="text-gray-300 text-sm">About</label>
                <textarea
                  {...register("about")}
                  rows="3"
                  className={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-red-600 hover:bg-red-700 transition text-white rounded-lg font-semibold shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
