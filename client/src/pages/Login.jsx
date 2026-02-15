import { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

const schema = yup.object().shape({
  email: yup.string().email("Please enter a valid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const res = await login(data);

    if (!res) {
      alert("We couldn't find an account with those details. Please try again.");
      return;
    }

    if (res.role === "lawyer") {
      navigate("/dashboard-lawyer");
    } else {
      navigate("/dashboard-client");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center px-6 relative overflow-hidden">
        
        {/* AMBIENT BACKGROUND GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* HEADER AREA */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-2xl mb-6">
              <span className="text-red-600 text-xl font-bold">LS</span>
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">Sign In</h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">Welcome back to LegalSphere.</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#0A0A0A] border border-white/5 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-2xl"
          >
            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Email Address</label>
              <input
                {...register("email")}
                placeholder="name@example.com"
                className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-800"
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div className="mt-6 space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Password</label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-800"
              />
              {errors.password && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              disabled={isSubmitting}
              className="w-full mt-10 py-4 bg-red-600 hover:bg-red-500 transition-all text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "Sign In"}
            </button>

            {/* REDIRECT TO REGISTER */}
            <div className="mt-8 text-center border-t border-white/5 pt-8">
              <p className="text-gray-600 text-xs font-medium">
                New to the platform?
              </p>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="mt-3 text-red-500 hover:text-red-400 transition-colors text-sm font-bold"
              >
                Create a Free Account
              </button>
            </div>
          </form>

          {/* FOOTER INFO */}
          <p className="mt-10 text-center text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">
            Secure Session // Encryption Active
          </p>
        </div>
      </div>
    </PageTransition>
  );
}