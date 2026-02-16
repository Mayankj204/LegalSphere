// CalendarView.jsx
import React, { useState, useEffect, useMemo } from "react";
import hearingService from "../services/hearingService";
import {
  startOfMonth,
  startOfWeek,
  addDays,
  format,
  isSameDay,
  isToday,
} from "date-fns";

export default function CalendarView() {
  const [current, setCurrent] = useState(new Date());
  const [matrix, setMatrix] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    type: "Hearing",
  });

  /* ================= LOAD ================= */

  useEffect(() => {
    buildCalendar();
    loadEvents();
  }, [current]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const loadEvents = async () => {
    try {
      const res = await hearingService.getHearings();
      setEvents(res || []);
    } catch (err) {
      console.error("Calendar Sync Error:", err);
    }
  };

  const buildCalendar = () => {
    const start = startOfWeek(startOfMonth(current), { weekStartsOn: 1 });
    const rows = [];
    let curr = start;

    for (let r = 0; r < 6; r++) {
      const cols = [];
      for (let c = 0; c < 7; c++) {
        cols.push(curr);
        curr = addDays(curr, 1);
      }
      rows.push(cols);
    }
    setMatrix(rows);
  };

  const prevMonth = () =>
    setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));

  const nextMonth = () =>
    setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  /* ================= FILTER ================= */

  const eventsForDay = (day) =>
    events.filter((ev) => isSameDay(new Date(ev.date), day));

  const selectedDayEvents = useMemo(
    () => eventsForDay(selectedDay),
    [selectedDay, events]
  );

  /* ================= MODAL LOGIC ================= */

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      time: "",
      type: "Hearing",
    });
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      time: format(new Date(event.date), "HH:mm"),
      type: event.type || "Hearing",
    });
    setShowModal(true);
  };

  /* ================= SUBMIT (FIXED) ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const baseDate = editingEvent
        ? new Date(editingEvent.date)
        : new Date(selectedDay);

      const [hours, minutes] = formData.time.split(":");

      baseDate.setHours(parseInt(hours));
      baseDate.setMinutes(parseInt(minutes));
      baseDate.setSeconds(0);

      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: baseDate,
      };

      if (editingEvent) {
        await hearingService.updateHearing(editingEvent._id, payload);
      } else {
        await hearingService.createHearing(payload);
      }

      setShowModal(false);
      setEditingEvent(null);
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to save hearing");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hearing?")) return;

    try {
      await hearingService.deleteHearing(id);
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] to-[#0f0f0f] text-slate-200 p-8 md:pl-72">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Court Calendar
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            {format(current, "MMMM yyyy")}
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={prevMonth} className="px-4 py-2 bg-white/5 rounded-xl text-xs">
            ←
          </button>
          <button onClick={nextMonth} className="px-4 py-2 bg-white/5 rounded-xl text-xs">
            →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">

        {/* CALENDAR GRID */}
        <div className="lg:col-span-8 bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl shadow-xl">

          <div className="grid grid-cols-7 text-center mb-4 text-[10px] text-gray-500 uppercase tracking-widest">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {matrix.map((row, ri) =>
              row.map((day, ci) => {
                const evs = eventsForDay(day);
                const isSelected = isSameDay(day, selectedDay);
                const today = isToday(day);

                return (
                  <div
                    key={`${ri}-${ci}`}
                    onClick={() => setSelectedDay(day)}
                    className={`p-3 rounded-2xl cursor-pointer border min-h-[95px]
                      ${isSelected ? "bg-red-600/10 border-red-500/40" : "bg-black border-white/5"}
                    `}
                  >
                    <div className={`text-xs mb-2 flex justify-between
                      ${today ? "text-red-400 font-bold" : "text-gray-400"}
                    `}>
                      {format(day, "d")}
                      {evs.length > 0 && (
                        <span className="text-[8px] bg-red-600 text-white px-2 py-0.5 rounded-full">
                          {evs.length}
                        </span>
                      )}
                    </div>

                    {evs.slice(0, 2).map((e) => (
                      <div
                        key={e._id}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          openEditModal(e);
                        }}
                        className="text-[9px] bg-red-600/20 text-red-400 px-2 py-1 rounded mb-1 truncate"
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl shadow-xl flex flex-col">

          <h3 className="text-lg text-white mb-4">
            {format(selectedDay, "do MMMM yyyy")}
          </h3>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {selectedDayEvents.length === 0 ? (
              <p className="text-xs text-gray-600 italic">
                No hearings scheduled.
              </p>
            ) : (
              selectedDayEvents.map((e) => (
                <div key={e._id} className="p-4 bg-black border border-white/5 rounded-xl">
                  <p className="text-sm text-white font-semibold">{e.title}</p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(e.date), "HH:mm")}
                  </p>

                  <div className="flex gap-4 mt-3 text-xs">
                    <button
                      onClick={() => openEditModal(e)}
                      className="text-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={openAddModal}
            className="mt-6 bg-red-600 py-3 rounded-xl text-xs font-bold uppercase"
          >
            + Add Hearing
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 w-full max-w-lg relative">
            
            {/* CLOSE BUTTON (X) */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>

            <h3 className="text-xl text-white mb-6">
              {editingEvent ? "Edit Hearing" : "Add Hearing"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Case Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-3 bg-black border border-white/10 rounded-xl text-sm"
              />

              <input
                required
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full p-3 bg-black border border-white/10 rounded-xl text-sm"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 bg-black border border-white/10 rounded-xl text-sm"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-red-600 py-3 rounded-xl text-xs font-bold uppercase"
                >
                  {editingEvent ? "Update Hearing" : "Save Hearing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}