// hearingController.js
const Hearing = require("../models/Hearing");

exports.list = async (req, res) => {
  try {
    const hearings = await Hearing.find().sort({ date: 1 }).limit(100);
    res.json({ ok: true, hearings });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = req.body;
    const h = new Hearing(payload);
    await h.save();
    res.json({ ok:true, hearing: h });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
};
