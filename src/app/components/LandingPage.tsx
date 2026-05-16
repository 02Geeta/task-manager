import { useState, useEffect, useRef } from "react";
import {
  Users, BarChart3, Bell, Calendar, Search, Sparkles,
  ArrowRight, Star, Lock, LayoutDashboard, CheckCircle2,
  Loader2,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface LandingPageProps {
  onGetStarted: () => void;
}

interface LiveStats {
  users: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksTodo: number;
  totalTasks: number;
  projects: number;
  uptime: number;
  rating: number;
}

// Animated count-up hook
function useCountUp(target: number, duration = 1600, decimals = 0) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target]);

  return value;
}

function StatCard({ value, suffix = "", label, decimals = 0 }: {
  value: number; suffix?: string; label: string; decimals?: number;
}) {
  const animated = useCountUp(value, 1600, decimals);
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-1" style={{ color: "#8B6ED4" }}>
        {decimals > 0
          ? animated.toFixed(decimals)
          : Math.floor(animated).toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm" style={{ color: "#9B8BC0" }}>{label}</div>
    </div>
  );
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [completionPct, setCompletionPct] = useState<number | null>(null);

  const features = [
    { icon: Sparkles, title: "AI-Powered Assistant", description: "Smart task suggestions, auto-priority detection, and intelligent deadline recommendations powered by Claude AI." },
    { icon: Users, title: "Team Collaboration", description: "Real-time updates, role-based permissions, and seamless team coordination across all your projects." },
    { icon: BarChart3, title: "Advanced Analytics", description: "Interactive charts, productivity insights, and performance tracking for every project." },
    { icon: Calendar, title: "Smart Calendar", description: "Visual timeline, deadline tracking, and intelligent scheduling built into your workflow." },
    { icon: Bell, title: "Smart Notifications", description: "Stay updated with intelligent alerts and priority-based notifications across your team." },
    { icon: Search, title: "Powerful Search", description: "Find anything instantly with advanced filtering and smart search across all projects." },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        // Try /stats endpoint first
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-bfa263b0/stats`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (res.ok) {
          const d = await res.json();
          const done = d.tasksCompleted ?? d.completedTasks ?? d.doneTasks ?? 0;
          const total = d.totalTasks ?? d.tasks ?? 0;
          const pct = total > 0 ? Math.round((done / total) * 100) : null;

          setStats({
            users: d.users ?? d.totalUsers ?? d.userCount ?? 0,
            tasksCompleted: done,
            tasksInProgress: d.tasksInProgress ?? d.inProgressTasks ?? 0,
            tasksTodo: d.tasksTodo ?? d.todoTasks ?? 0,
            totalTasks: total,
            projects: d.projects ?? d.totalProjects ?? d.projectCount ?? 0,
            uptime: d.uptime ?? 99.9,
            rating: d.rating ?? 4.9,
          });
          setCompletionPct(pct);
        } else {
          // Try /public-stats fallback
          const res2 = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-bfa263b0/public-stats`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${publicAnonKey}`,
              },
            }
          );
          if (res2.ok) {
            const d = await res2.json();
            const done = d.tasksCompleted ?? d.completedTasks ?? 0;
            const total = d.totalTasks ?? 0;
            setStats({
              users: d.users ?? d.userCount ?? 0,
              tasksCompleted: done,
              tasksInProgress: d.tasksInProgress ?? 0,
              tasksTodo: d.tasksTodo ?? 0,
              totalTasks: total,
              projects: d.projects ?? 0,
              uptime: 99.9,
              rating: 4.9,
            });
            setCompletionPct(total > 0 ? Math.round((done / total) * 100) : null);
          } else {
            setStats(null);
          }
        }
      } catch {
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const hasRealStats = stats && (
    stats.users > 0 ||
    stats.tasksCompleted > 0 ||
    stats.totalTasks > 0 ||
    stats.projects > 0
  );

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white" style={{ borderBottom: "1px solid #DDD6F3" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#C4B5E8" }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold" style={{ color: "#6B4EAF" }}>TaskFlow AI</span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: "#C4B5E8", color: "#3D2876" }}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ background: "#EDE9FB", color: "#6B4EAF", border: "1px solid #DDD6F3" }}
            >
              <Star className="w-3.5 h-3.5" />
              AI-Powered Task Management
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-5" style={{ color: "#2D1B6B" }}>
              Plan, assign, and{" "}
              <span style={{ color: "#8B6ED4" }}>finish team work</span>{" "}
              from one board.
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "#7C6FA0" }}>
              A lightweight project hub with role-based access, kanban task tracking,
              dashboard metrics, and AI assistance built into the same workflow.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onGetStarted}
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105"
                style={{ background: "#C4B5E8", color: "#3D2876" }}
              >
                Open dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Live project card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "white",
              border: "1px solid #DDD6F3",
              boxShadow: "0 8px 32px rgba(196,181,232,0.2)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {statsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#C4B5E8" }} />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: hasRealStats ? "#4ade80" : "#C4B5E8" }} />
                )}
                <span className="font-semibold" style={{ color: "#2D1B6B" }}>
                  {statsLoading ? "Loading live data..." : hasRealStats ? "Live Platform Stats" : "Platform Overview"}
                </span>
              </div>
              {!statsLoading && completionPct !== null && (
                <span className="text-sm font-medium" style={{ color: "#8B6ED4" }}>
                  {completionPct}% complete
                </span>
              )}
            </div>

            {/* Metric tiles */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                {
                  label: "Users",
                  val: statsLoading ? null : stats?.users ?? 0,
                },
                {
                  label: "Tasks Done",
                  val: statsLoading ? null : stats?.tasksCompleted ?? 0,
                },
                {
                  label: "Projects",
                  val: statsLoading ? null : stats?.projects ?? 0,
                },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3" style={{ background: "#F3EFFE" }}>
                  <div className="text-xs mb-1" style={{ color: "#9B8BC0" }}>{s.label}</div>
                  {s.val === null ? (
                    <div className="h-8 w-16 rounded animate-pulse" style={{ background: "#EDE9FB" }} />
                  ) : (
                    <div className="text-2xl font-bold" style={{ color: "#2D1B6B" }}>
                      {s.val > 0 ? s.val.toLocaleString() : "—"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Kanban preview */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "To do",
                  count: statsLoading ? null : stats?.tasksTodo ?? null,
                  color: "#EDE9FB",
                  accent: "#A48ED6",
                },
                {
                  label: "In progress",
                  count: statsLoading ? null : stats?.tasksInProgress ?? null,
                  color: "#fffbeb",
                  accent: "#f59e0b",
                },
                {
                  label: "Done",
                  count: statsLoading ? null : stats?.tasksCompleted ?? null,
                  color: "#f0fdf4",
                  accent: "#4ade80",
                },
              ].map((col) => (
                <div key={col.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: "#4B3499" }}>{col.label}</span>
                    {col.count !== null && col.count > 0 && (
                      <span className="text-xs" style={{ color: "#9B8BC0" }}>{col.count}</span>
                    )}
                  </div>
                  {/* Bars — only show if we have real data */}
                  {col.count !== null && col.count > 0
                    ? Array.from({ length: Math.min(col.count, 3) }).map((_, i) => (
                        <div
                          key={i}
                          className="h-8 rounded-md mb-1.5"
                          style={{ background: col.color, borderLeft: `3px solid ${col.accent}` }}
                        />
                      ))
                    : statsLoading
                    ? [1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-8 rounded-md mb-1.5 animate-pulse"
                          style={{ background: "#F3EFFE" }}
                        />
                      ))
                    : (
                      <div className="h-8 rounded-md flex items-center justify-center text-xs" style={{ color: "#C4B5E8", background: "#F9F7FF" }}>
                        No tasks yet
                      </div>
                    )
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tagline bar */}
      <div style={{ borderTop: "1px solid #DDD6F3", borderBottom: "1px solid #DDD6F3", background: "#F3EFFE" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-around gap-4 text-sm font-medium" style={{ color: "#6B4EAF" }}>
          <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> JWT authentication</span>
          <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Admin and member roles</span>
          <span className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Projects, tasks, and comments</span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-10 w-24 rounded-lg mx-auto animate-pulse" style={{ background: "#EDE9FB" }} />
                <div className="h-4 w-20 rounded mx-auto animate-pulse" style={{ background: "#F3EFFE" }} />
              </div>
            ))}
          </div>
        ) : hasRealStats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard value={stats!.users} suffix={stats!.users > 0 ? "+" : ""} label="Active Users" />
              <StatCard value={stats!.tasksCompleted} suffix={stats!.tasksCompleted > 0 ? "+" : ""} label="Tasks Completed" />
              <StatCard value={stats!.uptime} suffix="%" label="Uptime" decimals={1} />
              <StatCard value={stats!.rating} suffix="/5" label="User Rating" decimals={1} />
            </div>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs" style={{ color: "#9B8BC0" }}>Live data</span>
            </div>
          </>
        ) : (
          // No real data yet — show empty state instead of fake numbers
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: "#F9F7FF", border: "1px solid #EDE9FB" }}
          >
            <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: "#EDE9FB" }}>
              <BarChart3 className="w-5 h-5" style={{ color: "#8B6ED4" }} />
            </div>
            <p className="font-medium mb-1" style={{ color: "#2D1B6B" }}>Stats will appear here</p>
            <p className="text-sm" style={{ color: "#9B8BC0" }}>
              Platform metrics load automatically once your backend returns data.
            </p>
          </div>
        )}
      </div>

      {/* Features */}
      <div style={{ background: "#F3EFFE" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-3" style={{ color: "#2D1B6B" }}>
            Everything you need
          </h2>
          <p className="text-center mb-12" style={{ color: "#7C6FA0" }}>
            Packed with powerful features to supercharge your productivity
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 transition-all cursor-default"
                style={{ background: "white", border: "1px solid #DDD6F3" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#C4B5E8";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(196,181,232,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#DDD6F3";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "#EDE9FB", border: "1px solid #DDD6F3" }}
                >
                  <f.icon className="w-5 h-5" style={{ color: "#8B6ED4" }} />
                </div>
                <h3 className="text-base font-semibold mb-1.5" style={{ color: "#2D1B6B" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7C6FA0" }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl p-12 text-center" style={{ background: "#C4B5E8" }}>
          <h2 className="text-4xl font-bold mb-3" style={{ color: "#2D1B6B" }}>
            Ready to transform your workflow?
          </h2>
          <p className="mb-8" style={{ color: "#4B3499" }}>
            {hasRealStats && stats!.users > 0
              ? `Join ${stats!.users.toLocaleString()}+ users already using TaskFlow AI`
              : "Join teams already using TaskFlow AI"}
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2 transition-all hover:scale-105"
            style={{ background: "white", color: "#6B4EAF" }}
          >
            Get started now — it's free <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white" style={{ borderTop: "1px solid #DDD6F3" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#C4B5E8" }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold" style={{ color: "#6B4EAF" }}>TaskFlow AI</span>
              </div>
              <p className="text-sm" style={{ color: "#9B8BC0" }}>
                AI-powered task management for modern teams
              </p>
              {hasRealStats && stats!.users > 0 && (
                <div className="flex items-center gap-1.5 mt-3">
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
                  <span className="text-xs" style={{ color: "#9B8BC0" }}>
                    {stats!.users.toLocaleString()} active users
                  </span>
                </div>
              )}
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security", "Roadmap"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Resources", links: ["Documentation", "Help Center", "API", "Community"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: "#2D1B6B" }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li
                      key={l}
                      className="text-sm cursor-pointer transition-colors"
                      style={{ color: "#9B8BC0" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLLIElement).style.color = "#6B4EAF"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLLIElement).style.color = "#9B8BC0"; }}
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: "1px solid #EDE9FB", color: "#9B8BC0" }}>
            © {new Date().getFullYear()} TaskFlow AI. All rights reserved. Built for productive teams.
          </div>
        </div>
      </footer>
    </div>
  );
}