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
      languages: Array.isArray(user?.languages)
        ? user.languages.join(", ")
        : "",
      practiceAreas: Array.isArray(user?.practiceAreas)
        ? user.practiceAreas.join(", ")
        : "",
      courts: Array.isArray(user?.courts)
        ? user.courts.join(", ")
        : "",
      education: Array.isArray(user?.education)
        ? user.education.join(", ")
        : "",
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

      // Convert comma-separated fields into arrays
      ["languages", "practiceAreas", "courts", "education"].forEach((field) => {
        if (data[field]) {
          data[field] = data[field]
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      });

      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      <div className="pt-3 pb-20 px-6">
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
                Lawyer
              </span>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2 p-8 bg-black/40 backdrop-blur-xl border border-red-600/20 rounded-xl shadow-lg shadow-red-600/10">
            <h2 className="text-2xl font-bold text-white mb-6">
              Professional Account Settings
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

              <input {...register("name")} placeholder="Full Name" className={inputStyle} />
              <input {...register("phone")} placeholder="Phone" className={inputStyle} />
              <input {...register("city")} placeholder="City" className={inputStyle} />
              <input {...register("specialization")} placeholder="Specialization" className={inputStyle} />
              <input type="number" {...register("experience")} placeholder="Experience (Years)" className={inputStyle} />
              <input {...register("barCouncilId")} placeholder="Bar Council ID" className={inputStyle} />
              <input type="number" {...register("consultationFee")} placeholder="Consultation Fee" className={inputStyle} />
              <input {...register("languages")} placeholder="Languages (comma separated)" className={inputStyle} />
              <input {...register("practiceAreas")} placeholder="Practice Areas (comma separated)" className={inputStyle} />
              <input {...register("courts")} placeholder="Courts (comma separated)" className={inputStyle} />
              <input {...register("education")} placeholder="Education (comma separated)" className={inputStyle} />
              <input {...register("officeAddress")} placeholder="Office Address" className={inputStyle} />
              <input type="number" {...register("enrolledYear")} placeholder="Enrolled Year" className={inputStyle} />
              <input type="number" {...register("casesHandled")} placeholder="Cases Handled" className={inputStyle} />
              <input type="number" {...register("successRate")} placeholder="Success Rate (%)" className={inputStyle} />

              <select {...register("availability")} className={inputStyle}>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Unavailable">Unavailable</option>
              </select>

              <textarea
                {...register("bio")}
                rows="4"
                placeholder="Professional Bio"
                className={inputStyle}
              />

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
