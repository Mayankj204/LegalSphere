// CalendarView.jsx (simple interactive monthly calendar)
import React, { useState, useEffect } from "react";
import hearingService from "../services/hearingService";
import { startOfMonth, endOfMonth, startOfWeek, addDays, format, isSameDay, parseISO } from "date-fns";

export default function CalendarView() {
  const [current, setCurrent] = useState(new Date());
  const [matrix, setMatrix] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => { build(); loadEvents(); }, [current]);

  const loadEvents = async () => {
    const res = await hearingService.getHearings();
    setEvents(res || []);
  };

  const build = () => {
    const start = startOfWeek(startOfMonth(current), {weekStartsOn:1});
    const rows = [];
    let curr = start;
    for (let r=0;r<6;r++){
      const cols=[];
      for (let c=0;c<7;c++){
        cols.push(curr);
        curr = addDays(curr,1);
      }
      rows.push(cols);
    }
    setMatrix(rows);
  };

  const prevMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth()-1, 1));
  const nextMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth()+1, 1));

  const eventsForDay = (day) => {
    return events.filter(ev => {
      const evDate = new Date(ev.date);
      return isSameDay(evDate, day);
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pl-80">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="px-3 py-1 bg-[#111] rounded border border-red-600/20">Prev</button>
          <button onClick={nextMonth} className="px-3 py-1 bg-[#111] rounded border border-red-600/20">Next</button>
        </div>
      </div>

      <div className="mt-6 bg-[#111] p-4 rounded border border-red-600/20">
        <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-400">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2">
          {matrix.map((row,ri) => row.map((day,ci) => {
            const evs = eventsForDay(day);
            const isCurrMonth = day.getMonth() === current.getMonth();
            return (
              <div key={`${ri}-${ci}`} className={`p-2 min-h-20 rounded ${isCurrMonth ? "bg-[#0d0d0d]" : "bg-[#070707]"} border border-red-600/10`}>
                <div className="flex justify-between items-start">
                  <div className="text-xs text-gray-300">{format(day,"d")}</div>
                </div>

                <div className="mt-2 space-y-1">
                  {evs.slice(0,2).map(e=>
                    <div key={e._id} className="text-xs p-1 bg-red-600/10 rounded text-red-300">
                      {e.title}
                    </div>
                  )}
                  {evs.length>2 && <div className="text-xs text-gray-400">+{evs.length-2} more</div>}
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
