// client/src/pages/TasksReminders.jsx
import React, { useEffect, useState } from "react";
import workspaceService from "../services/workspaceService";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function TasksReminders() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ caseId: "", title: "", dueDate: "" });

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getTasks();
      setTasks(data || []);
    } catch (err) {
      console.error("Task retrieval failed:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const addTask = async () => {
    if (!form.title.trim() || !form.caseId.trim()) return;
    try {
      await workspaceService.addTask(form.caseId, { title: form.title, dueDate: form.dueDate });
      setShowAdd(false);
      setForm({ caseId: "", title: "", dueDate: "" });
      loadTasks();
    } catch (err) { console.error("Task creation failed:", err); }
  };

  const toggleComplete = async (taskId) => {
    try {
      await workspaceService.toggleTask(taskId);
      loadTasks();
    } catch (err) { console.error("Status update failed:", err); }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-slate-200 pt-28 pb-20 px-8">
        
        {/* HEADER SECTION */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
              Operational Tasks
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-mono mt-1">
              Active Directives // {tasks.filter(t => !t.completed).length} Pending
            </p>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95"
          >
            + Create Directive
          </button>
        </div>

        {/* TASK GRID */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-20 text-center font-mono text-[10px] text-gray-500 uppercase tracking-[0.4em] animate-pulse">Syncing Task Node...</div>
          ) : tasks.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-white/5 rounded-[2.5rem]">
              <p className="text-[10px] text-gray-700 uppercase tracking-[0.4em]">No active directives in queue</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasks
                .sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0))
                .map((t) => (
                  <div
                    key={t._id}
                    className={`group relative p-6 rounded-[2rem] border transition-all duration-500 ${
                      t.completed
                        ? "bg-black/40 border-green-600/10 opacity-60 grayscale"
                        : "bg-[#0A0A0A] border-white/5 hover:border-red-600/30 shadow-2xl"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="checkbox"
                            checked={t.completed}
                            onChange={() => toggleComplete(t._id)}
                            className="w-4 h-4 rounded-full border-2 border-red-600/30 bg-black appearance-none checked:bg-green-500 checked:border-green-500 transition-all cursor-pointer"
                          />
                          <p className={`text-sm font-semibold tracking-tight ${t.completed ? "line-through text-gray-600" : "text-white"}`}>
                            {t.title}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          {t.caseId && (
                            <button
                              onClick={() => navigate(`/case/${t.caseId}/workspace`)}
                              className="text-[9px] font-black text-red-500 uppercase tracking-tighter hover:underline"
                            >
                              REF: CASE_{t.caseId.substring(0, 8)} ↗
                            </button>
                          )}
                          <span className="text-[9px] font-mono text-gray-600 uppercase">
                            DUE: {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-GB') : "IMMEDIATE"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                         <p className="text-[8px] font-mono text-gray-800 uppercase">Registered</p>
                         <p className="text-[9px] font-mono text-gray-600">{new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ADD MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
            <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-fade-in">
              <h3 className="text-xl font-light text-white mb-8 tracking-tight">New Legal Directive</h3>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-600 mb-2 block ml-1 tracking-widest">Case Reference ID</label>
                  <input
                    placeholder="Enter Unique Case ID"
                    value={form.caseId}
                    onChange={(e) => setForm((s) => ({ ...s, caseId: e.target.value }))}
                    className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:border-red-600 outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-600 mb-2 block ml-1 tracking-widest">Directive Title</label>
                  <input
                    placeholder="e.g. File rejoinder for Exhibit A"
                    value={form.title}
                    onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                    className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:border-red-600 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-600 mb-2 block ml-1 tracking-widest">Deadline</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))}
                    className="w-full p-4 bg-black border border-white/5 rounded-2xl text-sm text-white focus:border-red-600 outline-none transition-all invert brightness-200"
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-3">
                <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-xs text-gray-600 hover:text-white transition-colors uppercase font-bold tracking-widest">Discard</button>
                <button onClick={addTask} className="px-8 py-3 bg-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-red-500 shadow-lg shadow-red-600/20">Commit Directive</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}