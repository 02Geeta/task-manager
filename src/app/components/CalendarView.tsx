import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  status: string;
}

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

export function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const getTasksForDate = (date: Date) =>
    tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });

  const getPriorityStyle = (priority: string): React.CSSProperties => {
    switch (priority) {
      case "High":
        return { background: "rgba(233,168,168,0.55)", border: "1px solid rgba(220,120,120,0.5)", color: "#7A2020" };
      case "Medium":
        return { background: "rgba(212,196,240,0.65)", border: "1px solid rgba(172,148,220,0.6)", color: "#3D2876" };
      case "Low":
        return { background: "rgba(168,220,196,0.55)", border: "1px solid rgba(120,190,152,0.5)", color: "#1A5C3A" };
      default:
        return { background: "rgba(196,181,232,0.5)", border: "1px solid rgba(172,148,220,0.5)", color: "#3D2876" };
    }
  };

  const previousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const goToday = () => setCurrentDate(new Date());

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const days: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isToday = (day: number | null) => {
    if (!day) return false;
    const t = new Date();
    return (
      day === t.getDate() &&
      currentDate.getMonth() === t.getMonth() &&
      currentDate.getFullYear() === t.getFullYear()
    );
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(243,239,254,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.75)",
        boxShadow: "0 8px 40px rgba(139,110,212,0.14)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(196,181,232,0.45)",
              border: "1px solid rgba(196,181,232,0.6)",
            }}
          >
            <CalendarIcon className="w-4 h-4" style={{ color: "#6B4EAF" }} />
          </div>
          <h2 className="text-base font-semibold" style={{ color: "#2D1B6B" }}>
            Calendar View
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-xs font-medium rounded-xl transition-all hover:scale-105"
            style={{
              background: "rgba(196,181,232,0.4)",
              border: "1px solid rgba(196,181,232,0.55)",
              color: "#4B3499",
            }}
          >
            Today
          </button>
          <button
            onClick={previousMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(196,181,232,0.4)",
            }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: "#6B4EAF" }} />
          </button>
          <span
            className="text-sm font-medium min-w-[140px] text-center"
            style={{ color: "#3D2876" }}
          >
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(196,181,232,0.4)",
            }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: "#6B4EAF" }} />
          </button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold py-2 rounded-lg"
            style={{
              color: "#6B4EAF",
              background: "rgba(196,181,232,0.22)",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, index) => {
          const date = day
            ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            : null;
          const dayTasks = date ? getTasksForDate(date) : [];
          const todayCell = isToday(day);

          return (
            <div
              key={index}
              className="min-h-[96px] p-2 rounded-xl transition-all"
              style={
                day
                  ? todayCell
                    ? {
                        background: "rgba(172,148,220,0.28)",
                        border: "1.5px solid rgba(172,148,220,0.7)",
                      }
                    : {
                        background: "rgba(255,255,255,0.45)",
                        border: "1px solid rgba(196,181,232,0.35)",
                      }
                  : {
                      background: "transparent",
                      border: "1px solid transparent",
                    }
              }
            >
              {day && (
                <>
                  <div
                    className="text-xs font-semibold mb-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                    style={
                      todayCell
                        ? { background: "rgba(107,78,175,0.85)", color: "#fff" }
                        : { color: "#4B3499" }
                    }
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task.id)}
                        className="text-xs px-2 py-1 rounded-lg cursor-pointer transition-all hover:scale-105 truncate font-medium"
                        style={{
                          backdropFilter: "blur(4px)",
                          ...getPriorityStyle(task.priority),
                        }}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div
                        className="text-xs font-medium px-1"
                        style={{ color: "#8B6ED4" }}
                      >
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}