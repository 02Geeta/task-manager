import { Brain, TrendingUp, AlertTriangle, CheckCircle, Target, Users } from "lucide-react";

interface AIInsightsProps {
  analytics: {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
    overdueTasks: number;
    members: any[];
  };
}

export function AIInsights({ analytics }: AIInsightsProps) {
  const generateInsights = () => {
    const insights = [];

    const completionRate = analytics.totalTasks > 0
      ? (analytics.doneTasks / analytics.totalTasks) * 100 : 0;
    const overdueRate = analytics.totalTasks > 0
      ? (analytics.overdueTasks / analytics.totalTasks) * 100 : 0;
    const workInProgressRate = analytics.totalTasks > 0
      ? (analytics.inProgressTasks / analytics.totalTasks) * 100 : 0;

    if (completionRate >= 70) {
      insights.push({ type: "success", icon: CheckCircle, title: "Excellent Progress!",
        message: `Your team has completed ${completionRate.toFixed(0)}% of tasks. Keep up the great work!`,
        bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.35)", iconBg: "rgba(74,222,128,0.2)", iconColor: "#16a34a", titleColor: "#14532d" });
    } else if (completionRate >= 40) {
      insights.push({ type: "info", icon: TrendingUp, title: "Steady Progress",
        message: `${completionRate.toFixed(0)}% of tasks completed. Consider focusing on completing in-progress tasks.`,
        bg: "rgba(196,181,232,0.15)", border: "rgba(196,181,232,0.4)", iconBg: "rgba(196,181,232,0.25)", iconColor: "#6B4EAF", titleColor: "#2D1B6B" });
    } else if (analytics.totalTasks > 0) {
      insights.push({ type: "warning", icon: Target, title: "Room for Improvement",
        message: "Only a few tasks completed. Break down complex tasks into smaller, manageable pieces.",
        bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.35)", iconBg: "rgba(251,191,36,0.2)", iconColor: "#b45309", titleColor: "#78350f" });
    }

    if (overdueRate > 20) {
      insights.push({ type: "critical", icon: AlertTriangle, title: "High Overdue Rate",
        message: `${analytics.overdueTasks} tasks are overdue. Consider reassessing deadlines or redistributing work.`,
        bg: "rgba(248,113,113,0.10)", border: "rgba(248,113,113,0.35)", iconBg: "rgba(248,113,113,0.2)", iconColor: "#dc2626", titleColor: "#7f1d1d" });
    } else if (analytics.overdueTasks > 0) {
      insights.push({ type: "warning", icon: AlertTriangle, title: "Overdue Tasks Detected",
        message: `${analytics.overdueTasks} task(s) overdue. Review and prioritize these items.`,
        bg: "rgba(251,146,60,0.10)", border: "rgba(251,146,60,0.35)", iconBg: "rgba(251,146,60,0.2)", iconColor: "#ea580c", titleColor: "#7c2d12" });
    }

    if (analytics.members.length > 0) {
      const taskCounts = analytics.members.map((m) => m.taskCount);
      const maxTasks = Math.max(...taskCounts);
      const minTasks = Math.min(...taskCounts);
      const avgTasks = taskCounts.reduce((a, b) => a + b, 0) / taskCounts.length;

      if (maxTasks - minTasks > 5 && analytics.members.length > 1) {
        insights.push({ type: "info", icon: Users, title: "Unbalanced Workload",
          message: `Task distribution varies significantly (${minTasks}–${maxTasks} per person). Consider rebalancing.`,
          bg: "rgba(196,181,232,0.15)", border: "rgba(196,181,232,0.4)", iconBg: "rgba(196,181,232,0.25)", iconColor: "#6B4EAF", titleColor: "#2D1B6B" });
      } else if (analytics.members.length > 1) {
        insights.push({ type: "success", icon: Users, title: "Well-Balanced Team",
          message: `Tasks are evenly distributed (avg: ${avgTasks.toFixed(1)} per person). Great team balance!`,
          bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.35)", iconBg: "rgba(74,222,128,0.2)", iconColor: "#16a34a", titleColor: "#14532d" });
      }
    }

    if (workInProgressRate > 50) {
      insights.push({ type: "warning", icon: Target, title: "Too Many WIP Tasks",
        message: "Over 50% of tasks are in progress. Focus on completing current tasks before starting new ones.",
        bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.35)", iconBg: "rgba(251,191,36,0.2)", iconColor: "#b45309", titleColor: "#78350f" });
    }

    if (analytics.totalTasks === 0) {
      insights.push({ type: "info", icon: Target, title: "Getting Started",
        message: "Create your first tasks to start tracking progress. Break down your project into actionable items.",
        bg: "rgba(196,181,232,0.15)", border: "rgba(196,181,232,0.4)", iconBg: "rgba(196,181,232,0.25)", iconColor: "#6B4EAF", titleColor: "#2D1B6B" });
    }

    return insights;
  };

  const insights = generateInsights();
  if (insights.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.40)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.65)",
        boxShadow: "0 4px 24px rgba(139,110,212,0.10)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(196,181,232,0.35)", border: "1px solid rgba(196,181,232,0.5)" }}
        >
          <Brain className="w-4 h-4 text-[#6B4EAF]" />
        </div>
        <h3 className="text-base font-semibold text-[#2D1B6B]">AI Insights</h3>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: "rgba(196,181,232,0.35)", color: "#6B4EAF", border: "1px solid rgba(196,181,232,0.5)" }}
        >
          Powered by AI
        </span>
      </div>

      {/* Insight cards */}
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="rounded-xl p-4 transition-all"
            style={{
              background: insight.bg,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: `1px solid ${insight.border}`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: insight.iconBg }}
              >
                <insight.icon className="w-4 h-4" style={{ color: insight.iconColor }} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1" style={{ color: insight.titleColor }}>
                  {insight.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: insight.titleColor, opacity: 0.8 }}>
                  {insight.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="mt-5 pt-4 text-center text-xs"
        style={{ borderTop: "1px solid rgba(196,181,232,0.3)", color: "#9B8BC0" }}
      >
        AI analyses your project data to provide actionable insights
      </div>
    </div>
  );
}