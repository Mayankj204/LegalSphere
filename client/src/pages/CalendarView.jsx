// CalendarView.jsx
import React, { useState, useEffect, useMemo } from "react";
import hearingService from "../services/hearingService";
import { 
  startOfMonth, endOfMonth, startOfWeek, addDays, 
  format, isSameDay, isToday, parseISO 
} from "date-fns";

export default function CalendarView() {
  const [current, setCurrent] = useState(new Date());
  const [matrix, setMatrix] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => { build(); loadEvents(); }, [current]);

  const loadEvents = async () => {
    try {
      const res = await hearingService.getHearings();
      setEvents(res || []);
    } catch (err) {
      console.error("Calendar Sync Error:", err);
    }
  };

  const build = () => {
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

  const prevMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const eventsForDay = (day) => {
    return events.filter(ev => isSameDay(new Date(ev.date), day));
  };

  const selectedDayEvents = useMemo(() => eventsForDay(selectedDay), [selectedDay, events]);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-8 pl-24 md:pl-72 transition-all duration-500">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
            Hearing Schedule
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-mono mt-1">
            {format(current, "MMMM yyyy")} // Central Registry
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0A0A0A] p-1.5 rounded-2xl border border-white/5">
          <button onClick={prevMonth} className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest px-4 text-white">
            {format(current, "MMM yyyy")}
          </span>
          <button onClick={nextMonth} className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CALENDAR GRID */}
        <div className="lg:col-span-8 bg-[#0A0A0A] border border-white/5 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

          <div className="grid grid-cols-7 gap-1 text-center mb-6 relative z-10">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(d => (
              <div key={d} className="text-[9px] font-black text-gray-600 tracking-[0.2em]">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 relative z-10">
            {matrix.map((row, ri) => row.map((day, ci) => {
              const evs = eventsForDay(day);
              const isCurrMonth = day.getMonth() === current.getMonth();
              const isSelected = isSameDay(day, selectedDay);
              const today = isToday(day);

              return (
                <div 
                  key={`${ri}-${ci}`} 
                  onClick={() => setSelectedDay(day)}
                  className={`
                    cursor-pointer p-2 min-h-[90px] md:min-h-[110px] rounded-2xl border transition-all duration-300 relative group
                    ${isSelected ? "bg-red-600/10 border-red-600/40" : "bg-black/40 border-white/5 hover:border-white/10"}
                    ${!isCurrMonth && "opacity-20"}
                  `}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-mono ${today ? "text-red-500 font-bold underline underline-offset-4" : "text-gray-500"}`}>
                      {format(day, "dd")}
                    </span>
                    {evs.length > 0 && (
                      <div className="w-1 h-1 bg-red-600 rounded-full shadow-[0_0_5px_rgba(220,38,38,0.8)]" />
                    )}
                  </div>

                  <div className="space-y-1">
                    {evs.slice(0, 2).map(e => (
                      <div key={e._id} className="text-[8px] p-1.5 bg-red-600/10 border border-red-600/20 rounded-md text-red-400 font-bold uppercase truncate tracking-tighter">
                        {e.title}
                      </div>
                    ))}
                    {evs.length > 2 && (
                      <div className="text-[8px] text-gray-600 font-mono mt-1 ml-1">+{evs.length - 2} ADDTL</div>
                    )}
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* DAY AGENDA SIDEBAR */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[2rem] shadow-2xl flex-1 overflow-hidden flex flex-col">
            <div className="mb-6">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Selected Agenda</p>
              <h3 className="text-xl font-light text-white mt-1">{format(selectedDay, "do MMMM")}</h3>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {selectedDayEvents.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-dashed border-white/10 flex items-center justify-center text-gray-700 mb-4 font-mono text-xs">
                    ∅
                  </div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest">No Hearings Logged</p>
                </div>
              ) : (
                selectedDayEvents.map(e => (
                  <div key={e._id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-red-600/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-mono text-red-500">{format(new Date(e.date), "HH:mm")}</span>
                      <span className="text-[8px] bg-red-600/20 text-red-400 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">{e.type || "Hearing"}</span>
                    </div>
                    <p className="text-xs font-semibold text-white group-hover:text-red-500 transition-colors leading-tight">{e.title}</p>
                    <p className="text-[10px] text-gray-500 mt-2 line-clamp-2 italic">{e.description || "No specific instructions provided."}</p>
                  </div>
                ))
              )}
            </div>
            
            <button className="mt-6 w-full py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95">
              + Add Hearing
            </button>
          </div>

          <div className="bg-red-600/5 border border-red-600/20 p-5 rounded-[2rem]">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">Security Sync</p>
            <p className="text-[9px] text-red-400/60 font-mono leading-relaxed">
              Records are cryptographically synchronized with the Central Court Registry for LegalSphere Node V2.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}