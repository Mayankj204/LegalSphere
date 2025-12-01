// src/pages/Register.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name required"),
  email: yup.string().email("Valid email required").required(),
  password: yup.string().min(6, "Min 6 chars").required(),
  role: yup.string().oneOf(["client", "lawyer"]).required()
});

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: "client" }
  });

  const onSubmit = async (data) => {
    try {
      // TODO: send to backend
      toast.success("Registered (demo)");
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="pt-32 flex justify-center px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-ls-charcoal/50 backdrop-blur-xl p-8 rounded-lg-2 max-w-md w-full border border-ls-red/10 shadow-card">

        <h2 className="text-3xl font-bold text-center text-ls-offwhite">Create Account</h2>

        <div className="mt-6">
          <label className="text-ls-offwhite text-sm">Name</label>
          <input {...register("name")} className="w-full mt-1 p-3 bg-ls-darkgrey border border-ls-red/10 rounded-lg" />
          {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
        </div>

        <div className="mt-4">
          <label className="text-ls-offwhite text-sm">Email</label>
          <input {...register("email")} className="w-full mt-1 p-3 bg-ls-darkgrey border border-ls-red/10 rounded-lg" />
          {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
        </div>

        <div className="mt-4">
          <label className="text-ls-offwhite text-sm">Password</label>
          <input type="password" {...register("password")} className="w-full mt-1 p-3 bg-ls-darkgrey border border-ls-red/10 rounded-lg" />
          {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>}
        </div>

        <div className="mt-4">
          <label className="text-ls-offwhite text-sm">Role</label>
          <select {...register("role")} className="w-full mt-1 p-3 bg-ls-darkgrey border border-ls-red/10 rounded-lg">
            <option value="client">Client</option>
            <option value="lawyer">Lawyer</option>
          </select>
          {errors.role && <p className="text-sm text-red-400 mt-1">{errors.role.message}</p>}
        </div>

        <button disabled={isSubmitting} className="w-full mt-6 py-3 bg-gradient-to-r from-ls-red to-ls-red text-white rounded-lg font-semibold shadow-glow hover:opacity-90 transition">
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
