// taskController.js
const Task = require("../models/Task");

exports.list = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }).limit(200);
    res.json({ ok:true, tasks });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const t = new Task(req.body);
    await t.save();
    res.json({ ok:true, task: t });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const t = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ok:true, task: t });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
};
