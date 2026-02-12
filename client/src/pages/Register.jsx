// src/pages/Register.jsx
import { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const schema = yup.object().shape({
  name: yup.string().required("Name required"),
  email: yup.string().email("Valid email required").required("Email required"),
  password: yup.string().min(6, "Min 6 chars").required("Password required"),
  role: yup.string().oneOf(["client", "lawyer"]).required(),
});

export default function Register() {
  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: "client" },
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);

      toast.success("Registered successfully!");

      if (data.role === "lawyer") {
        navigate("/dashboard-lawyer");
      } else {
        navigate("/dashboard-client");
      }
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="pt-32 flex justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black/40 backdrop-blur-xl p-8 rounded-xl max-w-md w-full border border-red-600/20 shadow-lg shadow-red-600/10"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Create Account
        </h2>

        {/* NAME */}
        <div className="mt-6">
          <label className="text-gray-300 text-sm">Name</label>
          <input
            {...register("name")}
            className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none"
          />
          {errors.name && (
            <p className="text-sm text-red-400 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mt-4">
          <label className="text-gray-300 text-sm">Email</label>
          <input
            {...register("email")}
            className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none"
          />
          {errors.email && (
            <p className="text-sm text-red-400 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mt-4">
          <label className="text-gray-300 text-sm">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none"
          />
          {errors.password && (
            <p className="text-sm text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ROLE */}
        <div className="mt-4">
          <label className="text-gray-300 text-sm">Role</label>
          <select
            {...register("role")}
            className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none"
          >
            <option value="client">Client</option>
            <option value="lawyer">Lawyer</option>
          </select>
          {errors.role && (
            <p className="text-sm text-red-400 mt-1">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          disabled={isSubmitting}
          className="w-full mt-6 py-3 bg-red-600 hover:bg-red-700 transition text-white rounded-lg font-semibold shadow-lg shadow-red-600/20"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
