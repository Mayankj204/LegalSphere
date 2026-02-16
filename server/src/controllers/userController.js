import User from "../models/User.js";

/* ==============================
   UPDATE USER (Name Only)
   ============================== */

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        ok: false,
        message: "Name is required",
      });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    res.json({
      ok: true,
      user: updated,
    });

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};
