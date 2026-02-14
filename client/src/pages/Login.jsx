import { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required")
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
      alert("Login failed");
      return;
    }

    if (res.role === "lawyer") {
      navigate("/dashboard-lawyer");
    } else {
      navigate("/dashboard-client");
    }
  };

  return (
    <div className="flex justify-center pt-32 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black/40 border border-red-600/20 backdrop-blur-xl p-8 rounded-xl max-w-md w-full shadow-lg shadow-red-600/10"
      >
        <h2 className="text-3xl font-bold text-center text-white">Login</h2>

        <div className="mt-6">
          <label className="text-gray-300 text-sm">Email</label>
          <input
            {...register("email")}
            className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none focus:border-red-600"
          />
          {errors.email && (
            <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="text-gray-300 text-sm">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none focus:border-red-600"
          />
          {errors.password && (
            <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full mt-6 py-3 bg-red-600 hover:bg-red-700 transition text-white rounded-lg font-semibold shadow-lg shadow-red-600/20"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {/* Redirect to Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Not registered yet?
          </p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="mt-2 text-red-500 hover:text-red-400 transition font-semibold"
          >
            Create an Account
          </button>
        </div>
      </form>
    </div>
  );
}
