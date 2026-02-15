import Lawyer from "../models/Lawyer.js";

/* ===========================
   GET ALL LAWYERS (Search + Filters)
   =========================== */
export const getAllLawyers = async (req, res) => {
  try {
    const { search, city, specialization, minExp } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (city) {
      filter.city = city;
    }

    if (specialization) {
      filter.specialization = specialization;
    }

    if (minExp) {
      filter.experience = { $gte: Number(minExp) };
    }

    const lawyers = await Lawyer.find(filter).select("-password");

    res.json(lawyers);
  } catch (err) {
    console.error("Get lawyers error:", err);
    res.status(500).json({ error: "Failed to fetch lawyers" });
  }
};

/* ===========================
   GET SINGLE LAWYER
   =========================== */
export const getLawyerById = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id).select("-password");

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found" });
    }

    res.json(lawyer);
  } catch (err) {
    console.error("Get lawyer error:", err);
    res.status(500).json({ error: "Failed to fetch lawyer" });
  }
};