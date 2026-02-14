import { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const schema = yup.object().shape({
  name: yup.string().required("Name required"),
  email: yup.string().email("Valid email required").required(),
  password: yup.string().min(6, "Min 6 chars").required(),
  role: yup.string().oneOf(["client", "lawyer"]).required(),

  specialization: yup.string().when("role", {
    is: "lawyer",
    then: (schema) => schema.required("Specialization required"),
  }),

  experience: yup.number().when("role", {
    is: "lawyer",
    then: (schema) => schema.required("Experience required"),
  }),

  city: yup.string().when("role", {
    is: "lawyer",
    then: (schema) => schema.required("City required"),
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

  return (
    <div className="flex justify-center pt-32 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black/40 border border-red-600/20 backdrop-blur-xl p-8 rounded-xl max-w-md w-full shadow-lg shadow-red-600/10"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Create Account
        </h2>

        {/* NAME */}
        <div className="mt-6">
          <label className="text-gray-300 text-sm">Full Name</label>
          <input
            {...register("name")}
            className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none focus:border-red-600"
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
            className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none focus:border-red-600"
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
            className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none focus:border-red-600"
          />
          {errors.password && (
            <p className="text-sm text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ROLE */}
        <div className="mt-4">
          <label className="text-gray-300 text-sm">Register As</label>
          <select
            {...register("role")}
            className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none focus:border-red-600"
          >
            <option value="client">Client</option>
            <option value="lawyer">Lawyer</option>
          </select>
        </div>

        {/* LAWYER EXTRA FIELDS */}
        {selectedRole === "lawyer" && (
          <>
            <div className="mt-4">
              <label className="text-gray-300 text-sm">
                Specialization
              </label>
              <input
                {...register("specialization")}
                className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none focus:border-red-600"
              />
              {errors.specialization && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="text-gray-300 text-sm">
                Experience (Years)
              </label>
              <input
                type="number"
                {...register("experience")}
                className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none focus:border-red-600"
              />
              {errors.experience && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="text-gray-300 text-sm">City</label>
              <input
                {...register("city")}
                className="w-full mt-1 p-3 bg-black/60 text-white border border-red-600/20 rounded-lg focus:outline-none focus:border-red-600"
              />
              {errors.city && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          </>
        )}

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
