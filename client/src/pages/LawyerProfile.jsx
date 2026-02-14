import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLawyerById } from "../services/lawyerService";

export default function LawyerProfile() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);

  useEffect(() => {
    const fetchLawyer = async () => {
      const data = await getLawyerById(id);
      setLawyer(data);
    };
    fetchLawyer();
  }, [id]);

  if (!lawyer) return <div>Loading...</div>;

  return (
    <div className="pt-32 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{lawyer.name}</h1>
      <p className="mt-2">{lawyer.specialization}</p>
      <p>Experience: {lawyer.experience} years</p>
      <p>City: {lawyer.city}</p>
      <p>Email: {lawyer.email}</p>
      <p className="mt-4">{lawyer.bio}</p>
    </div>
  );
}
