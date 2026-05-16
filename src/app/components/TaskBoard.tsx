import { Plus, Calendar, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: "Low" | "Medium" | "High";
  status: "To Do" | "In Progress" | "Done";
  assignedTo: string | null;
}

interface TaskBoardProps {
  tasks: Task[];
  members: any[];
  isAdmin: boolean;
  onCreateTask: () => void;
  onUpdateTask: (taskId: string, updates: any) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskBoard({
  tasks,
  members,
  isAdmin,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}: TaskBoardProps) {
  const columns: { id: "To Do" | "In Progress" | "Done"; color: string; dot: string }[] = [
    { id: "To Do",       color: "rgba(196,181,232,0.55)", dot: "#8B6ED4" },
    { id: "In Progress", color: "rgba(252,220,144,0.40)", dot: "#B07A00" },
    { id: "Done",        color: "rgba(168,220,196,0.40)", dot: "#1A7A4A" },
  ];

  const getTasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status);

  const getPriorityStyle = (priority: string): React.CSSProperties => {
    switch (priority) {
      case "High":
        return { background: "rgba(233,168,168,0.50)", border: "1px solid rgba(220,120,120,0.45)", color: "#7A2020" };
      case "Medium":
        return { background: "rgba(212,196,240,0.55)", border: "1px solid rgba(172,148,220,0.55)", color: "#3D2876" };
      case "Low":
        return { background: "rgba(168,220,196,0.50)", border: "1px solid rgba(120,190,152,0.45)", color: "#1A5C3A" };
      default:
        return { background: "rgba(196,181,232,0.40)", border: "1px solid rgba(172,148,220,0.45)", color: "#3D2876" };
    }
  };

  const isOverdue = (dueDate: string | null) =>
    dueDate ? new Date(dueDate) < new Date() : false;

  const getMemberName = (memberId: string | null) => {
    if (!memberId) return "Unassigned";
    const m = members.find((m) => m.id === memberId);
    return m?.name || "Unknown";
  };

  const getMemberInitials = (memberId: string | null) => {
    const name = getMemberName(memberId);
    if (name === "Unassigned") return "—";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
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
        <h2 className="text-base font-semibold" style={{ color: "#2D1B6B" }}>
          Task Board
        </h2>
        {isAdmin && (
          <button
            onClick={onCreateTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{
              background: "rgba(172,148,220,0.70)",
              border: "1px solid rgba(172,148,220,0.80)",
              color: "#2D1B6B",
              boxShadow: "0 4px 12px rgba(139,110,212,0.18)",
            }}
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        )}
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(({ id, color, dot }) => (
          <div
            key={id}
            className="rounded-xl p-4"
            style={{
              background: color,
              border: "1px solid rgba(196,181,232,0.35)",
            }}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: dot }}
                />
                <h3 className="text-sm font-semibold" style={{ color: "#2D1B6B" }}>
                  {id}
                </h3>
              </div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(196,181,232,0.40)",
                  color: "#6B4EAF",
                }}
              >
                {getTasksByStatus(id).length}
              </span>
            </div>

            {/* Task cards */}
            <div className="space-y-3">
              {getTasksByStatus(id).map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl p-4 transition-all hover:shadow-md"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.80)",
                    boxShadow: "0 2px 8px rgba(139,110,212,0.08)",
                  }}
                >
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4
                      className="text-sm font-semibold flex-1 leading-snug"
                      style={{ color: "#2D1B6B" }}
                    >
                      {task.title}
                    </h4>
                    {isOverdue(task.dueDate) && task.status !== "Done" && (
                      <AlertCircle
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: "#7A2020" }}
                        title="Overdue"
                      />
                    )}
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p
                      className="text-xs mb-3 leading-relaxed line-clamp-2"
                      style={{ color: "#7B6AAF" }}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                      style={getPriorityStyle(task.priority)}
                    >
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span
                        className="text-xs flex items-center gap-1"
                        style={{ color: "#8B6ED4" }}
                      >
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Assignee */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: "rgba(172,148,220,0.45)",
                        border: "1px solid rgba(196,181,232,0.55)",
                        color: "#3D2876",
                      }}
                    >
                      {getMemberInitials(task.assignedTo)}
                    </div>
                    <span className="text-xs" style={{ color: "#7B6AAF" }}>
                      {getMemberName(task.assignedTo)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {id !== "To Do" && (
                      <button
                        onClick={() =>
                          onUpdateTask(task.id, {
                            status: id === "In Progress" ? "To Do" : "In Progress",
                          })
                        }
                        className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all hover:scale-105"
                        style={{
                          background: "rgba(196,181,232,0.35)",
                          border: "1px solid rgba(196,181,232,0.50)",
                          color: "#4B3499",
                        }}
                      >
                        Back
                      </button>
                    )}
                    {id !== "Done" && (
                      <button
                        onClick={() =>
                          onUpdateTask(task.id, {
                            status: id === "To Do" ? "In Progress" : "Done",
                          })
                        }
                        className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all hover:scale-105"
                        style={{
                          background: "rgba(168,220,196,0.45)",
                          border: "1px solid rgba(120,190,152,0.45)",
                          color: "#1A5C3A",
                        }}
                      >
                        {id === "To Do" ? "Start" : "Complete"}
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all hover:scale-105 ml-auto"
                        style={{
                          background: "rgba(233,168,168,0.35)",
                          border: "1px solid rgba(220,120,120,0.35)",
                          color: "#7A2020",
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {getTasksByStatus(id).length === 0 && (
                <div
                  className="text-center py-8 text-xs font-medium rounded-xl"
                  style={{
                    color: "#9B8ACA",
                    background: "rgba(255,255,255,0.35)",
                    border: "1px dashed rgba(196,181,232,0.50)",
                  }}
                >
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}