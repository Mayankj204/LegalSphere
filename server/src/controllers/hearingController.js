import Hearing from "../models/Hearing.js";

/* GET */
export const getHearings = async (req, res) => {
  try {
    const hearings = await Hearing.find({
      lawyer: req.user._id,
    }).sort({ date: 1 });

    res.json(hearings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hearings" });
  }
};

/* CREATE */
export const createHearing = async (req, res) => {
  try {
    const hearing = await Hearing.create({
      ...req.body,
      lawyer: req.user._id,
    });

    res.status(201).json(hearing);
  } catch (err) {
    res.status(500).json({ error: "Failed to create hearing" });
  }
};

/* UPDATE */
export const updateHearing = async (req, res) => {
  try {
    const hearing = await Hearing.findOneAndUpdate(
      { _id: req.params.id, lawyer: req.user._id },
      req.body,
      { new: true }
    );

    if (!hearing)
      return res.status(404).json({ error: "Hearing not found" });

    res.json(hearing);
  } catch (err) {
    res.status(500).json({ error: "Failed to update hearing" });
  }
};

/* DELETE */
export const deleteHearing = async (req, res) => {
  try {
    const hearing = await Hearing.findOneAndDelete({
      _id: req.params.id,
      lawyer: req.user._id,
    });

    if (!hearing)
      return res.status(404).json({ error: "Hearing not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete hearing" });
  }
};
