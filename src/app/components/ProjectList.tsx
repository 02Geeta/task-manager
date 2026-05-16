import { Plus, FolderOpen } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  adminId: string;
  members: string[];
}

interface ProjectListProps {
  projects: Project[];
  selectedProject: string | null;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
  currentUserId: string;
}

export function ProjectList({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProject,
  currentUserId,
}: ProjectListProps) {
  return (
    <div
      className="h-full flex flex-col rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.7)",
        boxShadow: "0 4px 24px rgba(139,110,212,0.10)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[#2D1B6B]">My Projects</h2>
        <button
          onClick={onCreateProject}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[#3D2876] transition-all hover:scale-105 active:scale-95"
          style={{
            background: "rgba(196,181,232,0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 2px 8px rgba(139,110,212,0.15)",
          }}
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Project list */}
      {projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(196,181,232,0.3)",
              border: "1px solid rgba(196,181,232,0.4)",
            }}
          >
            <FolderOpen className="w-6 h-6 text-[#8B6ED4]" />
          </div>
          <p className="text-sm text-[#9B8BC0] text-center leading-relaxed">
            No projects yet.<br />Create one to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          {projects.map((project) => {
            const isSelected = selectedProject === project.id;
            const isAdmin = project.adminId === currentUserId;

            return (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="w-full text-left rounded-xl p-4 transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: isSelected
                    ? "rgba(196,181,232,0.45)"
                    : "rgba(255,255,255,0.35)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: isSelected
                    ? "1px solid rgba(196,181,232,0.75)"
                    : "1px solid rgba(255,255,255,0.6)",
                  boxShadow: isSelected
                    ? "0 4px 16px rgba(139,110,212,0.18)"
                    : "0 1px 6px rgba(139,110,212,0.06)",
                }}
              >
                {/* Project name row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Dot indicator */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
                      style={{
                        background: isSelected ? "#8B6ED4" : "#C4B5E8",
                      }}
                    />
                    <h3
                      className="font-semibold text-sm leading-snug"
                      style={{ color: isSelected ? "#2D1B6B" : "#4B3499" }}
                    >
                      {project.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-xs text-[#9B8BC0] mt-2 leading-relaxed line-clamp-2 pl-4">
                    {project.description}
                  </p>
                )}

                {/* Footer: members + admin badge */}
                <div className="flex items-center gap-2 mt-3 pl-4">
                  <div
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg"
                    style={{
                      background: "rgba(196,181,232,0.25)",
                      color: "#9B8BC0",
                    }}
                  >
                    <span>{project.members.length}</span>
                    <span>member{project.members.length !== 1 ? "s" : ""}</span>
                  </div>

                  {isAdmin && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-lg font-medium"
                      style={{
                        background: "rgba(196,181,232,0.35)",
                        color: "#6B4EAF",
                        border: "1px solid rgba(196,181,232,0.5)",
                      }}
                    >
                      Admin
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}