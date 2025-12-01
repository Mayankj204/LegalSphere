import express from "express";
import {
  getNotes,
  addNote,
  getTimeline,
  addTimelineEvent,
  getBilling,
  addBillingEntry,
  getHearings,
  addHearing,
  getTasks,
  addTask,
  toggleTask
} from "../controllers/caseSubController.js";

const router = express.Router();

/* NOTES */
router.get("/:caseId/notes", getNotes);
router.post("/:caseId/notes", addNote);

/* TIMELINE */
router.get("/:caseId/timeline", getTimeline);
router.post("/:caseId/timeline", addTimelineEvent);

/* BILLING */
router.get("/:caseId/billing", getBilling);
router.post("/:caseId/billing", addBillingEntry);

/* HEARINGS (GLOBAL) */
router.get("/hearings/all", getHearings);
router.post("/:caseId/hearings", addHearing);

/* TASKS (GLOBAL + CASE) */
router.get("/tasks/all", getTasks);
router.post("/:caseId/tasks", addTask);
router.patch("/tasks/:taskId/toggle", toggleTask);

export default router;
