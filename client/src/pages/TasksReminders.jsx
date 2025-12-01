// client/src/pages/TasksReminders.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../services/workspaceService";
import { useNavigate } from "react-router-dom";

export default function TasksReminders() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add task modal
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    caseId: "",
    title: "",
    dueDate: "",
  });

  /* -------------------- LOAD TASKS -------------------- */
  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getTasks();
      setTasks(data || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  /* -------------------- ADD TASK -------------------- */
  const addTask = async () => {
    if (!form.title.trim() || !form.caseId.trim()) {
      return alert("Case ID and task title are required");
    }

    try {
      await workspaceService.addTask(form.caseId, {
        title: form.title,
        dueDate: form.dueDate,
      });

      setShowAdd(false);
      setForm({ caseId: "", title: "", dueDate: "" });

      loadTasks();
    } catch (err) {
      console.error("Failed to add task:", err);
      alert("Failed to add task");
    }
  };

  /* -------------------- TOGGLE TASK COMPLETION -------------------- */
  const toggleComplete = async (taskId) => {
    try {
      await workspaceService.toggleTask(taskId);
      loadTasks();
    } catch (err) {
      console.error("Toggle failed:", err);
      alert("Failed to update task");
    }
  };

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks & Reminders ✅</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          + Add Task
        </button>
      </div>

      {/* TASKS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && <p className="text-gray-400">Loading tasks...</p>}

        {!loading && tasks.length === 0 && (
          <p className="text-gray-400">No tasks created.</p>
        )}

        {tasks
          .sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0))
          .map((t) => (
            <div
              key={t._id}
              className={`p-5 rounded border ${
                t.completed
                  ? "bg-[#0a0a0a] border-green-600/30"
                  : "bg-[#111] border-red-600/30"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p
                    className={`text-lg font-semibold ${
                      t.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {t.title}
                  </p>

                  {t.caseId && (
                    <button
                      onClick={() =>
                        navigate(`/case/${t.caseId}/workspace`)
                      }
                      className="text-xs text-red-400 underline mt-1"
                    >
                      Open Case
                    </button>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    {t.dueDate
                      ? `Due: ${new Date(t.dueDate).toLocaleDateString()}`
                      : "No due date"}
                  </p>
                </div>

                {/* TOGGLE CHECKBOX */}
                <div>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(t._id)}
                    className="w-5 h-5 cursor-pointer accent-red-600"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Created: {new Date(t.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
      </div>

      {/* ADD TASK MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="p-6 bg-[#111] rounded border border-red-600/30 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Task</h3>

            <input
              placeholder="Case ID"
              value={form.caseId}
              onChange={(e) =>
                setForm((s) => ({ ...s, caseId: e.target.value }))
              }
              className="w-full p-3 bg-[#0d0d0d] border border-red-600/20 rounded mb-3"
            />

            <input
              placeholder="Task Title"
              value={form.title}
              onChange={(e) =>
                setForm((s) => ({ ...s, title: e.target.value }))
              }
              className="w-full p-3 bg-[#0d0d0d] border border-red-600/20 rounded mb-3"
            />

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm((s) => ({ ...s, dueDate: e.target.value }))
              }
              className="w-full p-3 bg-[#0d0d0d] border border-red-600/20 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-2 bg-[#333] rounded hover:bg-[#444]"
              >
                Cancel
              </button>

              <button
                onClick={addTask}
                className="px-3 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
