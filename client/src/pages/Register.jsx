import { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";

const SPECIALIZATIONS = [
  "Criminal Law", "Civil Litigation", "Corporate Law", "Family Law", 
  "Intellectual Property", "Cyber Law", "Real Estate", "Tax Law", "Labor Law"
];

const STATES = [
  "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Gujarat"
];

const LANGUAGES = ["English", "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Kannada"];

const schema = yup.object().shape({
  name: yup.string().required("Please enter your full name"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
  role: yup.string().oneOf(["client", "lawyer"]).required(),

  // Lawyer Specific Validations
  specialization: yup.string().when("role", {
    is: "lawyer",
    then: (schema) => schema.required("Specialization is required"),
  }),
  experience: yup.number().typeError("Please enter a number").when("role", {
    is: "lawyer",
    then: (schema) => schema.required("Experience is required"),
  }),
  state: yup.string().when("role", {
    is: "lawyer",
    then: (schema) => schema.required("State is required"),
  }),
  city: yup.string().when("role", {
    is: "lawyer",
    then: (schema) => schema.required("City is required"),
  }),
  barCouncilId: yup.string().when("role", {
    is: "lawyer",
    then: (schema) => schema.required("Bar Council ID is required"),
  }),
  consultationFee: yup.number().typeError("Enter a numeric value").when("role", {
    is: "lawyer",
    then: (schema) => schema.required("Please set a fee"),
  }),
});

export default function Register() {
  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: "client" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    const res = await registerUser(data);
    if (res?.role === "lawyer") {
      navigate("/dashboard-lawyer");
    } else {
      navigate("/dashboard-client");
    }
  };

  const labelStyle = "text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1 mb-2 block";
  const inputStyle = "w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-red-600/50 transition-all appearance-none";
  const errorStyle = "text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-1 ml-1";

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center py-24 px-6 relative overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-red-600/[0.02] blur-[120px] pointer-events-none" />

        <div className="w-full max-w-2xl relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-2xl mb-6">
              <span className="text-red-600 text-xl font-bold">LS</span>
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">Join the LegalSphere network.</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#0A0A0A] border border-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-6"
          >
            {/* ACCOUNT BASICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Full Name</label>
                <input {...register("name")} placeholder="Full Name" className={inputStyle} />
                {errors.name && <p className={errorStyle}>{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelStyle}>I am a...</label>
                <select {...register("role")} className={inputStyle}>
                  <option value="client">Client </option>
                  <option value="lawyer">Lawyer </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Email Address</label>
                <input {...register("email")} placeholder="email@address.com" className={inputStyle} />
                {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelStyle}>Secure Password</label>
                <input type="password" {...register("password")} placeholder="••••••••" className={inputStyle} />
                {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
              </div>
            </div>

            {/* LAWYER SPECIFIC SECTIONS */}
            {selectedRole === "lawyer" && (
              <div className="pt-8 mt-8 border-t border-white/5 space-y-8 animate-fade-in">
                
                {/* PROFESSIONAL DETAILS */}
                <section className="space-y-6">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Professional Credentials</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelStyle}>Primary Specialization</label>
                      <select {...register("specialization")} className={inputStyle}>
                        <option value="">Select Area</option>
                        {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.specialization && <p className={errorStyle}>{errors.specialization.message}</p>}
                    </div>
                    <div>
                      <label className={labelStyle}>Bar Council Registration ID</label>
                      <input {...register("barCouncilId")} placeholder="ID Number" className={inputStyle} />
                      {errors.barCouncilId && <p className={errorStyle}>{errors.barCouncilId.message}</p>}
                    </div>
                  </div>
                </section>

                {/* LOCATION & JURISDICTION */}
                <section className="space-y-6">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Jurisdiction</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelStyle}>State</label>
                      <select {...register("state")} className={inputStyle}>
                        <option value="">Select State</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className={errorStyle}>{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className={labelStyle}>City</label>
                      <input {...register("city")} placeholder="City Name" className={inputStyle} />
                      {errors.city && <p className={errorStyle}>{errors.city.message}</p>}
                    </div>
                  </div>
                </section>

                {/* CASE EXPERIENCE (Replaced Availability) */}
                <section className="space-y-6">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Practice Metrics</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className={labelStyle}>Years Active</label>
                      <input type="number" {...register("experience")} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Cases Won</label>
                      <input type="number" {...register("casesWon")} placeholder="Est." className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Fee (₹/hr)</label>
                      <input type="number" {...register("consultationFee")} className={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Primary Languages</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {LANGUAGES.map(lang => (
                        <label key={lang} className="flex items-center gap-2 p-3 bg-black border border-white/5 rounded-xl cursor-pointer hover:border-red-600/30 transition-all">
                          <input type="checkbox" value={lang} {...register("languages")} className="accent-red-600" />
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            <button
              disabled={isSubmitting}
              className="w-full py-5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Syncing Registry..." : "Finalize Registration"}
            </button>
          </form>

          <p className="mt-10 text-center text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">
            Verified Onboarding // India Jurisdiction Node
          </p>
        </div>
      </div>
    </PageTransition>
  );
}