import { BarChart3, CheckCircle, Clock, AlertCircle, Users, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface DashboardProps {
  analytics: {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
    overdueTasks: number;
    members: any[];
  };
}

export function Dashboard({ analytics }: DashboardProps) {
  const stats = [
    { label: "Total Tasks",  value: analytics.totalTasks,      icon: BarChart3,   val: "text-[#6B4EAF]", icon_col: "text-[#8B6ED4]" },
    { label: "To Do",        value: analytics.todoTasks,       icon: Clock,       val: "text-[#8B6ED4]", icon_col: "text-[#A48ED6]" },
    { label: "In Progress",  value: analytics.inProgressTasks, icon: Clock,       val: "text-amber-500", icon_col: "text-amber-400" },
    { label: "Completed",    value: analytics.doneTasks,       icon: CheckCircle, val: "text-green-500", icon_col: "text-green-400" },
    { label: "Overdue",      value: analytics.overdueTasks,    icon: AlertCircle, val: "text-red-400",   icon_col: "text-red-400"   },
  ];

  const taskStatusData = [
    { name: "To Do",       value: analytics.todoTasks,       color: "#A48ED6" },
    { name: "In Progress", value: analytics.inProgressTasks, color: "#FBBF24" },
    { name: "Completed",   value: analytics.doneTasks,       color: "#4ADE80" },
    { name: "Overdue",     value: analytics.overdueTasks,    color: "#F87171" },
  ];

  const barChartData = [
    { name: "Total",       value: analytics.totalTasks,      fill: "#C4B5E8" },
    { name: "To Do",       value: analytics.todoTasks,       fill: "#A48ED6" },
    { name: "In Progress", value: analytics.inProgressTasks, fill: "#FBBF24" },
    { name: "Completed",   value: analytics.doneTasks,       fill: "#4ADE80" },
    { name: "Overdue",     value: analytics.overdueTasks,    fill: "#F87171" },
  ];

  const teamProductivityData = analytics.members.map((m) => ({
    name: m.name.split(" ")[0],
    tasks: m.taskCount,
  }));

  const completionRate = analytics.totalTasks > 0
    ? Math.round((analytics.doneTasks / analytics.totalTasks) * 100)
    : 0;

  // Glassmorphism class helpers
  const glass = "bg-white/50 backdrop-blur-xl border border-white/70 shadow-[0_4px_24px_rgba(139,110,212,0.10)]";
  const glassCard = "bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_2px_12px_rgba(139,110,212,0.08)]";

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    // Lavender gradient page background
    <div className="min-h-screen bg-gradient-to-br from-[#e8e0f7] via-[#f3effe] to-[#ede0fb] p-1">
      <div className={`${glass} rounded-3xl p-6 space-y-5`}>

        {/* ── Stat cards ── */}
        <div>
          <h2 className="text-base font-semibold text-[#2D1B6B] mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#8B6ED4]" />
            Dashboard Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {stats.map((s) => (
              <div key={s.label} className={`${glassCard} rounded-2xl p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#9B8BC0]">{s.label}</span>
                  <s.icon className={`w-4 h-4 ${s.icon_col}`} />
                </div>
                <div className={`text-3xl font-bold ${s.val}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Bar chart */}
          <div className={`${glassCard} rounded-2xl p-5`}>
            <h3 className="text-sm font-semibold text-[#2D1B6B] mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#8B6ED4]" />
              Task Distribution
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barChartData} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,181,232,0.3)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#9B8BC0", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9B8BC0", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(196,181,232,0.15)" }}
                  contentStyle={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", fontSize: "12px", color: "#2D1B6B" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className={`${glassCard} rounded-2xl p-5`}>
            <h3 className="text-sm font-semibold text-[#2D1B6B] mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#8B6ED4]" />
              Task Status Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={taskStatusData.filter((d) => d.value > 0)}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.88} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-1">
              {taskStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-[#9B8BC0]">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Completion pill */}
            <div className="mt-4 text-center bg-[rgba(196,181,232,0.25)] border border-[rgba(196,181,232,0.4)] rounded-xl py-3">
              <div className="text-xs text-[#9B8BC0]">Completion Rate</div>
              <div className="text-3xl font-bold text-[#6B4EAF]">{completionRate}%</div>
            </div>
          </div>
        </div>

        {/* ── Team Productivity ── */}
        <div className={`${glassCard} rounded-2xl p-5`}>
          <h3 className="text-sm font-semibold text-[#2D1B6B] mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#8B6ED4]" />
            Team Productivity
          </h3>

          {teamProductivityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={teamProductivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,181,232,0.3)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#9B8BC0", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9B8BC0", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#9B8BC0" }} />
                <Line
                  type="monotone" dataKey="tasks" name="Tasks Assigned"
                  stroke="#C4B5E8" strokeWidth={2.5}
                  dot={{ fill: "#8B6ED4", r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: "#6B4EAF" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-10 text-[#9B8BC0] text-sm">No team members yet</div>
          )}

          {/* Member cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            {analytics.members.map((member) => (
              <div
                key={member.id}
                className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[rgba(196,181,232,0.4)] border border-[rgba(196,181,232,0.5)] flex items-center justify-center text-xs font-bold text-[#6B4EAF] flex-shrink-0">
                    {getInitials(member.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#2D1B6B] truncate">{member.name}</div>
                    <div className="text-xs text-[#9B8BC0] truncate">{member.email}</div>
                    {member.isAdmin && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-[rgba(196,181,232,0.35)] text-[#6B4EAF] border border-[rgba(196,181,232,0.5)] rounded-md font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <div className="text-2xl font-bold text-[#8B6ED4]">{member.taskCount}</div>
                  <div className="text-xs text-[#9B8BC0]">tasks</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}