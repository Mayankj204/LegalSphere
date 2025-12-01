// src/pages/LawyerProfile.jsx

import PageTransition from "../components/PageTransition";

export default function LawyerProfile() {
  // Mock profile
  const profile = {
    name: "Amit Sharma",
    specialization: "Criminal Law",
    experience: "8 years",
    email: "amitlawyer@example.com",
  };

  return (
    <PageTransition>
      <div className="pt-32 px-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-ls-offwhite">
          Lawyer Profile
        </h1>

        <div className="mt-10 p-6 bg-ls-charcoal/40 border border-ls-red/10 rounded-lg-2 shadow-card">
          <h2 className="text-xl font-bold text-ls-offwhite">
            {profile.name}
          </h2>
          <p className="text-ls-muted mt-1">{profile.specialization}</p>

          <div className="mt-4 space-y-1">
            <p className="text-ls-offwhite">
              Experience: <span className="text-ls-red">{profile.experience}</span>
            </p>
            <p className="text-ls-offwhite">
              Email: <span className="text-ls-red">{profile.email}</span>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
