import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { AuthForm } from "./components/AuthForm";
import { ProjectList } from "./components/ProjectList";
import { TaskBoard } from "./components/TaskBoard";
import { Dashboard } from "./components/Dashboard";
import { AIInsights } from "./components/AIInsights";
import { ActivityFeed } from "./components/ActivityFeed";
import { Notifications } from "./components/Notifications";
import { CalendarView } from "./components/CalendarView";
import { CreateProjectModal } from "./components/CreateProjectModal";
import { CreateTaskModal } from "./components/CreateTaskModal";
import { ManageMembersModal } from "./components/ManageMembersModal";
import { LogOut, Users, LayoutDashboard, ListTodo, Calendar, Activity, Sparkles } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<"dashboard" | "tasks" | "calendar" | "activity">("dashboard");
  const [showLanding, setShowLanding] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState<{
    users: number; tasksDone: number; projects: number;
    todoTasks: number; inProgressTasks: number; doneTasks: number;
  } | null>(null);

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showManageMembers, setShowManageMembers] = useState(false);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bfa263b0${endpoint}`,
        {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken || publicAnonKey}`,
            ...options.headers,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API request failed");
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Network error");
    }
  };

  // Fetch platform-wide stats for the landing page card
  const loadPlatformStats = async () => {
    try {
      const data = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bfa263b0/stats`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      if (data.ok) {
        const json = await data.json();
        setPlatformStats({
          users: json.totalUsers ?? json.users ?? 0,
          tasksDone: json.tasksDone ?? json.completedTasks ?? 0,
          projects: json.totalProjects ?? json.projects ?? 0,
          todoTasks: json.todoTasks ?? 0,
          inProgressTasks: json.inProgressTasks ?? 0,
          doneTasks: json.doneTasks ?? json.tasksDone ?? 0,
        });
      }
    } catch {
      // Stats endpoint may not exist — landing page shows fallback gracefully
    }
  };

  const handleLogin = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    setShowLanding(false);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    addNotification("success", "Welcome back!", `Good to see you, ${userData.name}`);
  };

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
    setProjects([]);
    setSelectedProject(null);
    setTasks([]);
    setAnalytics(null);
    setShowLanding(true);
    setNotifications([]);
    setActivities([]);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  const addNotification = (type: string, title: string, message: string) => {
    setNotifications(prev => [{
      id: crypto.randomUUID(), type, title, message,
      timestamp: new Date().toISOString(), read: false,
    }, ...prev]);
  };

  const addActivity = (type: string, description: string) => {
    setActivities(prev => [{
      id: crypto.randomUUID(), type, description,
      userName: user?.name || "Unknown",
      timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 50));
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await apiCall("/projects");
      setProjects(data.projects || []);
      if (data.projects.length > 0 && !selectedProject) {
        setSelectedProject(data.projects[0].id);
      }
    } catch (error: any) {
      console.error("Load projects error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectData = async (projId: string) => {
    try {
      setLoading(true);
      const [tasksData, dashboardData] = await Promise.all([
        apiCall(`/projects/${projId}/tasks`),
        apiCall(`/dashboard/${projId}`),
      ]);
      setTasks(tasksData.tasks || []);
      setAnalytics(dashboardData);
    } catch (error: any) {
      console.error("Load project data error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (name: string, description: string) => {
    try {
      await apiCall("/projects", { method: "POST", body: JSON.stringify({ name, description }) });
      setShowCreateProject(false);
      await loadProjects();
      addNotification("success", "Project Created", `${name} has been created successfully`);
      addActivity("task_created", `created project "${name}"`);
    } catch (error: any) {
      alert(`Failed to create project: ${error.message}`);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      await apiCall("/tasks", {
        method: "POST",
        body: JSON.stringify({ projectId: selectedProject, ...taskData }),
      });
      setShowCreateTask(false);
      if (selectedProject) await loadProjectData(selectedProject);
      addActivity("task_created", `created task "${taskData.title}"`);
    } catch (error: any) {
      alert(`Failed to create task: ${error.message}`);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      await apiCall(`/tasks/${taskId}`, { method: "PUT", body: JSON.stringify(updates) });
      if (selectedProject) await loadProjectData(selectedProject);
      if (updates.status === "done") addActivity("task_completed", `completed a task`);
      else addActivity("task_updated", `updated a task`);
    } catch (error: any) {
      alert(`Failed to update task: ${error.message}`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await apiCall(`/tasks/${taskId}`, { method: "DELETE" });
      if (selectedProject) await loadProjectData(selectedProject);
      addActivity("task_deleted", `deleted a task`);
    } catch (error: any) {
      alert(`Failed to delete task: ${error.message}`);
    }
  };

  const handleAddMember = async (email: string) => {
    try {
      await apiCall(`/projects/${selectedProject}/members`, {
        method: "POST", body: JSON.stringify({ userEmail: email }),
      });
      if (selectedProject) await loadProjectData(selectedProject);
      addActivity("member_added", `added a new member`);
    } catch (error: any) {
      alert(`Failed to add member: ${error.message}`);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await apiCall(`/projects/${selectedProject}/members/${memberId}`, { method: "DELETE" });
      if (selectedProject) await loadProjectData(selectedProject);
    } catch (error: any) {
      alert(`Failed to remove member: ${error.message}`);
    }
  };

  // Restore session
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setUser(JSON.parse(savedUser));
      setShowLanding(false);
    }
  }, []);

  // Load platform stats for landing page on mount
  useEffect(() => {
    loadPlatformStats();
  }, []);

  useEffect(() => {
    if (accessToken && user) loadProjects();
  }, [accessToken, user]);

  useEffect(() => {
    if (selectedProject) loadProjectData(selectedProject);
  }, [selectedProject]);

  // ── Not logged in ──
  if (!accessToken || !user) {
    if (showLanding) return <LandingPage onGetStarted={() => setShowLanding(false)} platformStats={platformStats} />;
    return <AuthForm onLogin={handleLogin} />;
  }

  const currentProject = projects.find((p) => p.id === selectedProject);
  const isAdmin = currentProject?.adminId === user.id;

  // ── Logged in ──
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #e8e4f5 0%, #dbd5f0 40%, #cdc6eb 100%)" }}
    >
      {/* ── Navbar ── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(196,181,232,0.4)",
          boxShadow: "0 2px 24px rgba(139,110,212,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">

            {/* Logo + project name */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(196,181,232,0.45)", border: "1px solid rgba(196,181,232,0.6)" }}
              >
                <Sparkles className="w-5 h-5 text-[#6B4EAF]" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-[#2D1B6B] leading-tight">
                  TaskFlow AI
                </h1>
                {currentProject && (
                  <p className="text-xs text-[#9B8BC0] flex items-center gap-1.5 mt-0.5">
                    {currentProject.name}
                    {isAdmin && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: "rgba(196,181,232,0.35)",
                          color: "#6B4EAF",
                          border: "1px solid rgba(196,181,232,0.5)",
                        }}
                      >
                        Admin
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Notifications
                notifications={notifications}
                onMarkAsRead={(id) =>
                  setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
                }
                onDismiss={(id) =>
                  setNotifications(prev => prev.filter(n => n.id !== id))
                }
                onMarkAllAsRead={() =>
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                }
              />

              {/* Avatar + name */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: "rgba(196,181,232,0.2)", border: "1px solid rgba(196,181,232,0.35)" }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#6B4EAF]"
                  style={{ background: "rgba(196,181,232,0.5)" }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-[#4B3499] hidden sm:block">
                  {user.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{
                  color: "#6B4EAF",
                  background: "rgba(196,181,232,0.25)",
                  border: "1px solid rgba(196,181,232,0.4)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(196,181,232,0.45)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(196,181,232,0.25)")}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProjectList
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              onCreateProject={() => setShowCreateProject(true)}
              currentUserId={user.id}
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-5">
            {selectedProject && currentProject ? (
              <>
                {/* Tab bar */}
                <div
                  className="rounded-2xl p-2.5 flex items-center justify-between"
                  style={{
                    background: "rgba(255,255,255,0.50)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(196,181,232,0.35)",
                    boxShadow: "0 4px 24px rgba(139,110,212,0.08)",
                  }}
                >
                  <div className="flex gap-1.5">
                    {([
                      { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
                      { key: "tasks",     label: "Tasks",     Icon: ListTodo },
                      { key: "calendar",  label: "Calendar",  Icon: Calendar },
                      { key: "activity",  label: "Activity",  Icon: Activity },
                    ] as const).map(({ key, label, Icon }) => (
                      <button
                        key={key}
                        onClick={() => setActiveView(key)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={
                          activeView === key
                            ? { background: "rgba(107,79,175,0.85)", color: "#fff", boxShadow: "0 2px 12px rgba(107,79,175,0.3)" }
                            : { color: "#7A6BB5", background: "transparent" }
                        }
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowManageMembers(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: "#7A6BB5",
                      background: "rgba(196,181,232,0.25)",
                      border: "1px solid rgba(196,181,232,0.4)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(196,181,232,0.45)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(196,181,232,0.25)")}
                  >
                    <Users className="w-4 h-4" />
                    Members ({analytics?.members?.length || 0})
                  </button>
                </div>

                {/* View */}
                {loading ? (
                  <div
                    className="rounded-2xl p-12 text-center"
                    style={{
                      background: "rgba(255,255,255,0.5)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(196,181,232,0.35)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
                      style={{ borderColor: "#C4B5E8", borderTopColor: "transparent" }}
                    />
                    <p className="text-sm text-[#9B8BC0]">Loading...</p>
                  </div>
                ) : (
                  <>
                    {activeView === "dashboard" && analytics && (
                      <>
                        <Dashboard analytics={analytics} />
                        <AIInsights analytics={analytics} />
                      </>
                    )}
                    {activeView === "tasks" && (
                      <TaskBoard
                        tasks={tasks}
                        members={analytics?.members || []}
                        isAdmin={isAdmin}
                        onCreateTask={() => setShowCreateTask(true)}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                      />
                    )}
                    {activeView === "calendar" && (
                      <CalendarView
                        tasks={tasks}
                        onTaskClick={(taskId) => console.log("Task clicked:", taskId)}
                      />
                    )}
                    {activeView === "activity" && (
                      <ActivityFeed activities={activities} />
                    )}
                  </>
                )}
              </>
            ) : (
              !loading && (
                <div
                  className="rounded-2xl p-12 text-center"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(196,181,232,0.35)",
                    boxShadow: "0 4px 32px rgba(139,110,212,0.10)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(196,181,232,0.3)" }}
                  >
                    <LayoutDashboard className="w-8 h-8 text-[#6B4EAF]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2D1B6B]">
                    Welcome to TaskFlow AI
                  </h3>
                  <p className="text-sm mb-6 text-[#9B8BC0]">
                    Create your first project to get started
                  </p>
                  <button
                    onClick={() => setShowCreateProject(true)}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
                    style={{ background: "rgba(107,79,175,0.85)", boxShadow: "0 2px 12px rgba(107,79,175,0.3)" }}
                  >
                    Create Project
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onCreate={handleCreateProject}
        />
      )}
      {showCreateTask && analytics && (
        <CreateTaskModal
          members={analytics.members}
          onClose={() => setShowCreateTask(false)}
          onCreate={handleCreateTask}
        />
      )}
      {showManageMembers && currentProject && analytics && (
        <ManageMembersModal
          project={currentProject}
          members={analytics.members}
          currentUserId={user.id}
          onClose={() => setShowManageMembers(false)}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      )}
    </div>
  );
}