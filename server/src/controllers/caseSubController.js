// server/src/controllers/caseSubController.js

import Note from "../models/Note.js";
import Timeline from "../models/Timeline.js";
import Billing from "../models/Billing.js";
import Hearing from "../models/Hearing.js";
import Task from "../models/Task.js";

/* ============================================================
   NOTES
   ============================================================ */
export const getNotes = async (req, res) => {
  const { caseId } = req.params;
  try {
    const notes = await Note.find({ caseId }).sort({ createdAt: -1 });
    res.json({ ok: true, notes });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const addNote = async (req, res) => {
  const { caseId } = req.params;
  const { text } = req.body;

  try {
    const note = await Note.create({ caseId, text });
    res.json({ ok: true, note });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { text } = req.body;

  try {
    const updated = await Note.findByIdAndUpdate(
      noteId,
      { text },
      { new: true }
    );
    res.json({ ok: true, note: updated });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    await Note.findByIdAndDelete(noteId);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};



/* ============================================================
   TIMELINE
   ============================================================ */
export const getTimeline = async (req, res) => {
  const { caseId } = req.params;
  try {
    const timeline = await Timeline.find({ caseId }).sort({ timestamp: -1 });
    res.json({ ok: true, timeline });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const addTimelineEvent = async (req, res) => {
  const { caseId } = req.params;
  const { title, details, timestamp } = req.body;

  try {
    const evt = await Timeline.create({
      caseId,
      title,
      details,
      timestamp: timestamp || Date.now()
    });

    res.json({ ok: true, event: evt });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};


/* ============================================================
   BILLING
   ============================================================ */
export const getBilling = async (req, res) => {
  const { caseId } = req.params;
  try {
    const entries = await Billing.find({ caseId }).sort({ createdAt: -1 });
    res.json({ ok: true, billing: entries });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const addBillingEntry = async (req, res) => {
  const { caseId } = req.params;
  const { title, amount, description } = req.body;

  try {
    const entry = await Billing.create({ caseId, title, amount, description });
    res.json({ ok: true, entry });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};


/* ============================================================
   HEARINGS
   ============================================================ */
export const getHearings = async (req, res) => {
  try {
    const hearings = await Hearing.find().sort({ date: 1 });
    res.json({ ok: true, hearings });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const addHearing = async (req, res) => {
  const { caseId } = req.params;
  const { date, court, purpose } = req.body;

  try {
    const hearing = await Hearing.create({ caseId, date, court, purpose });
    res.json({ ok: true, hearing });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};


/* ============================================================
   TASKS
   ============================================================ */
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ ok: true, tasks });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const addTask = async (req, res) => {
  const { caseId } = req.params;
  const { title, dueDate } = req.body;

  try {
    const task = await Task.create({ caseId, title, dueDate });
    res.json({ ok: true, task });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const toggleTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    task.completed = !task.completed;
    await task.save();

    res.json({ ok: true, task });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
